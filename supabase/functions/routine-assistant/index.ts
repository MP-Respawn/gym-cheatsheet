/*
 * routine-assistant: a coach chats with Claude to put a routine together.
 *
 * Two modes (the app has a switch), to try both with INCA:
 *   coach    Claude Sonnet 5.5 with a personal-trainer skill (prompts.ts).
 *            Knows only our exercise names; may suggest exercises we don't
 *            have (with the closest one of ours to use meanwhile).
 *   catalog  Claude Haiku 5.5 grounded on our whole catalog. Only our
 *            exercises.
 *
 * The model proposes through the propose_routine tool, which has the shape
 * of the app's routine builder draft; the app fills the draft with it and
 * the coach reviews and saves as usual. This function never writes a routine.
 *
 * Stateless: the app sends the conversation so far (the messages this
 * function returned, untouched), the new message and the builder's current
 * draft; it gets back the messages to append, the reply text and the
 * proposal, if any. Every proposal is checked against the catalog: unknown
 * ids go back to the model as an error to fix (at most twice per message).
 *
 * Only coaches (and the superadmin), with a daily message limit per mode;
 * usage is counted in assistant_usage. The catalog and the instructions are
 * cached, so after the first message they cost about a tenth.
 *
 * Secrets: ANTHROPIC_API_KEY (npx supabase secrets set ANTHROPIC_API_KEY=...).
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase.
 * Deploy: npx supabase functions deploy routine-assistant --use-api
 * After changing the exercise catalog: npm run kb, then deploy again.
 */
import Anthropic from "npm:@anthropic-ai/sdk@1.3.0";
import { createClient } from "npm:@supabase/supabase-js@2.118.0";
import catalogFull from "./catalog-full.json" with { type: "json" };
import catalogNames from "./catalog-names.json" with { type: "json" };
import { CATALOG_RULES, COACH_SKILL } from "./prompts.ts";

type Mode = "coach" | "catalog";
type Message = Anthropic.Beta.BetaMessageParam;

const MODES = {
  coach: { model: "claude-sonnet-5-5", effort: "medium", dailyLimit: 60, rules: COACH_SKILL, catalog: catalogNames, newExercises: true },
  catalog: { model: "claude-haiku-5-5", effort: "low", dailyLimit: 150, rules: CATALOG_RULES, catalog: catalogFull, newExercises: false },
} as const;

const EXERCISE_IDS = new Set(catalogNames.exercises.map((e) => e.id));
const VUELTA_KEYS = new Set(catalogNames.vueltas.map((v) => v.key));
const MAX_FIXES = 2;

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const anthropic = Deno.env.get("ANTHROPIC_API_KEY") ? new Anthropic() : null;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

/* ---- The proposal tool: the routine builder's draft ---- */

function proposeTool(mode: Mode): Anthropic.Beta.BetaTool {
  const step: Record<string, unknown> = {
    exercise_ids: { type: "array", items: { type: "string" }, description: "1 id del catálogo, o 2-3 para superserie/circuito. Vacío si es una vuelta o un ejercicio nuevo." },
    vuelta: { type: "string", description: "Clave de una vuelta de abdomen de INCA, o \"\"." },
    sets: { type: "integer", description: "Series; 0 si no aplica." },
    reps: { type: "string", description: "Repeticiones o rango (\"8-10\"), o \"\"." },
    load_kg: { type: "number", description: "Kilos de referencia; 0 si no hay." },
    rest_sec: { type: "integer", description: "Pausa en segundos; 0 si no aplica." },
    text: { type: "string", description: "Indicaciones (tempo, técnica), o \"\"." },
    note: { type: "string", description: "Nota corta para el cliente, o \"\"." },
  };
  if (MODES[mode].newExercises) {
    step.new_exercise_name = { type: "string", description: "Solo si el ejercicio no está en el catálogo: su nombre. Si no, \"\"." };
    step.new_exercise_description = { type: "string", description: "Cómo se hace el ejercicio nuevo, o \"\"." };
    step.closest_id = { type: "string", description: "Para un ejercicio nuevo: el id del catálogo más parecido. Si no, \"\"." };
  }
  const object = (properties: Record<string, unknown>) => ({
    type: "object",
    additionalProperties: false,
    required: Object.keys(properties),
    properties,
  });
  return {
    name: "propose_routine",
    description:
      "Propone una rutina completa (o la versión corregida de la que el coach tiene abierta). Llena el borrador del constructor; el coach la revisa y la guarda.",
    strict: true,
    input_schema: object({
      name: { type: "string" },
      focus: { type: "string", description: "Resumen corto de la rutina." },
      days: {
        type: "array",
        items: object({
          name: { type: "string", description: "Nombre del día, o \"\" si es uno solo." },
          focus: { type: "string" },
          steps: { type: "array", items: object(step) },
        }),
      },
    }) as Anthropic.Beta.BetaTool.InputSchema,
  };
}

type Step = {
  exercise_ids: string[];
  vuelta: string;
  new_exercise_name?: string;
  closest_id?: string;
};
type Proposal = { name: string; focus: string; days: { name: string; steps: Step[] }[] };

// What is wrong with a proposal, in words the model can act on ([] = fine).
function problems(proposal: Proposal, mode: Mode): string[] {
  const found: string[] = [];
  if (!proposal.days?.length) found.push("La rutina no tiene días.");
  proposal.days?.forEach((day, d) => {
    if (!day.steps?.length) found.push(`El día ${d + 1} no tiene pasos.`);
    day.steps?.forEach((s, i) => {
      const where = `Día ${d + 1}, paso ${i + 1}`;
      if (s.vuelta) {
        if (!VUELTA_KEYS.has(s.vuelta)) found.push(`${where}: la vuelta "${s.vuelta}" no existe.`);
      } else if (s.new_exercise_name) {
        if (mode !== "coach") found.push(`${where}: en este modo solo se usan ejercicios del catálogo.`);
        else if (!EXERCISE_IDS.has(s.closest_id ?? "")) found.push(`${where}: closest_id "${s.closest_id}" no está en el catálogo.`);
      } else {
        if (!s.exercise_ids?.length || s.exercise_ids.length > 3) found.push(`${where}: tiene que tener de 1 a 3 ejercicios.`);
        for (const id of s.exercise_ids ?? []) {
          if (!EXERCISE_IDS.has(id)) found.push(`${where}: "${id}" no está en el catálogo.`);
        }
      }
    });
  });
  return found;
}

/* ---- Usage and limits ---- */

const today = () => new Date().toISOString().slice(0, 10);

async function usedToday(coachId: string, mode: Mode) {
  const { data } = await db.from("assistant_usage").select("*").eq("coach_id", coachId).eq("day", today()).eq("mode", mode).maybeSingle();
  return data ?? { messages: 0, input_tokens: 0, output_tokens: 0, cache_read_tokens: 0, cache_write_tokens: 0 };
}

async function addUsage(coachId: string, mode: Mode, before: Record<string, number>, usage: Record<string, number>) {
  await db.from("assistant_usage").upsert({
    coach_id: coachId,
    day: today(),
    mode,
    messages: before.messages + 1,
    input_tokens: before.input_tokens + usage.input,
    output_tokens: before.output_tokens + usage.output,
    cache_read_tokens: before.cache_read_tokens + usage.cacheRead,
    cache_write_tokens: before.cache_write_tokens + usage.cacheWrite,
  });
}

/* ---- The conversation ---- */

// The new user turn: answers to a proposal still pending from the last
// reply (the model's tool call needs its result), the builder's draft, and
// what the coach wrote.
function userTurn(history: Message[], message: string, draft: unknown): Message {
  const content: Anthropic.Beta.BetaContentBlockParam[] = [];
  const last = history.at(-1);
  if (last?.role === "assistant" && Array.isArray(last.content)) {
    for (const block of last.content) {
      if (block.type === "tool_use") {
        content.push({ type: "tool_result", tool_use_id: block.id, content: "El coach vio la propuesta en el constructor." });
      }
    }
  }
  if (draft) content.push({ type: "text", text: `<borrador>\n${JSON.stringify(draft)}\n</borrador>` });
  content.push({ type: "text", text: message });
  return { role: "user", content };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  // Who is asking: a signed-in coach (or the superadmin), not disabled.
  const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  const { data: auth } = token ? await db.auth.getUser(token) : { data: { user: null } };
  if (!auth.user) return json({ error: "Hace falta iniciar sesión." }, 401);
  const { data: profile } = await db.from("profiles").select("role, disabled_at").eq("id", auth.user.id).single();
  if (!profile || profile.disabled_at || !["trainer", "superadmin"].includes(profile.role)) {
    return json({ error: "El asistente es para coaches." }, 403);
  }
  if (!anthropic) return json({ error: "Falta ANTHROPIC_API_KEY en los secretos de la función." }, 500);

  const body = await req.json().catch(() => null);
  const mode: Mode = body?.mode === "catalog" ? "catalog" : "coach";
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 4000) : "";
  const history: Message[] = Array.isArray(body?.history) ? body.history : [];
  if (!message) return json({ error: "Escribí un mensaje." }, 400);

  const config = MODES[mode];
  const before = await usedToday(auth.user.id, mode);
  if (before.messages >= config.dailyLimit) {
    return json({ error: `Llegaste al límite de hoy (${config.dailyLimit} mensajes en este modo). Mañana se renueva.` }, 429);
  }

  const turn: Message[] = [userTurn(history, message, body?.draft ?? null)];
  const usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
  let proposal: Proposal | null = null;
  let notice = "";

  try {
    for (let attempt = 0; attempt <= MAX_FIXES; attempt++) {
      const response = await anthropic.beta.messages.create({
        model: config.model,
        max_tokens: 16000,
        output_config: { effort: config.effort },
        // Instructions, then the catalog; the cache breakpoint covers both.
        system: [
          { type: "text", text: config.rules },
          {
            type: "text",
            text: `Catálogo de la app (JSON):\n${JSON.stringify(config.catalog)}`,
            cache_control: { type: "ephemeral" },
          },
        ],
        tools: [proposeTool(mode)],
        messages: [...history, ...turn],
        // Sonnet: if its safety check declines a harmless request by mistake,
        // the same call continues on another model instead of failing.
        ...(mode === "coach" ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" } : {}),
      } as Anthropic.Beta.MessageCreateParamsNonStreaming);

      usage.input += response.usage.input_tokens;
      usage.output += response.usage.output_tokens;
      usage.cacheRead += response.usage.cache_read_input_tokens ?? 0;
      usage.cacheWrite += response.usage.cache_creation_input_tokens ?? 0;
      turn.push({ role: "assistant", content: response.content });

      if (response.stop_reason === "refusal") {
        notice = "El asistente no puede ayudar con ese pedido. Probá reformularlo.";
        break;
      }
      if (response.stop_reason === "max_tokens") {
        notice = "La respuesta quedó cortada. Pedile una rutina más corta o por partes.";
        break;
      }
      const call = response.content.find(
        (b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use" && b.name === "propose_routine",
      );
      if (!call) break;

      const found = problems(call.input as Proposal, mode);
      if (found.length === 0) {
        proposal = call.input as Proposal;
        break;
      }
      if (attempt === MAX_FIXES) {
        notice = "El asistente no logró una propuesta válida con el catálogo. Pedile que lo intente de nuevo.";
        break;
      }
      turn.push({
        role: "user",
        content: [{ type: "tool_result", tool_use_id: call.id, is_error: true, content: found.join("\n") }],
      });
    }
  } catch (e) {
    console.error(e);
    if (e instanceof Anthropic.RateLimitError || (e instanceof Anthropic.APIError && (e.status ?? 0) >= 500)) {
      return json({ error: "El asistente está ocupado. Probá de nuevo en un momento." }, 503);
    }
    return json({ error: "No se pudo consultar al asistente." }, 502);
  }

  await addUsage(auth.user.id, mode, before, usage);

  // The reply text: what the model wrote across this turn.
  const text = turn
    .filter((m) => m.role === "assistant")
    .flatMap((m) => (Array.isArray(m.content) ? m.content : []))
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n\n")
    .trim();

  return json({
    messages: turn,
    text: [text, notice].filter(Boolean).join("\n\n"),
    proposal,
    remainingToday: config.dailyLimit - before.messages - 1,
  });
});
