/*
 * exercise-request-email: the emails about "Pedir un ejercicio"
 *
 *   - a coach asks for an exercise   -> the superadmin(s) get an email,
 *                                       with "reply to" set to the coach
 *   - the request is answered        -> the coach who asked gets the answer
 *
 * The app calls this right after asking and right after answering, but the
 * call carries no data: the function looks in exercise_requests for what
 * has not been emailed yet (admin_notified_at / requester_notified_at),
 * marks it and sends it. So calling it twice sends nothing twice, a call
 * that failed is made up by the next one, and nobody can use it to email
 * whatever they like. It only answers signed-in users.
 *
 * Secrets (npx supabase secrets set NAME=value):
 *   RESEND_API_KEY  required, a Resend key with sending access
 *   EMAIL_FROM      optional, default "Respawn Fitness <avisos@respawnstudio.dev>"
 *   APP_URL         optional, default https://gym-cheatsheet.vercel.app
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase.
 *
 * Deploy: npx supabase functions deploy exercise-request-email --use-api
 */
import { createClient } from "npm:@supabase/supabase-js@2.118.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM = Deno.env.get("EMAIL_FROM") ?? "Respawn Fitness <avisos@respawnstudio.dev>";
const APP_URL = (Deno.env.get("APP_URL") ?? "https://gym-cheatsheet.vercel.app").replace(/\/$/, "");

// The service role skips row level security: this function decides itself what to send.
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const escape = (s: string) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

type Request = {
  id: string;
  name: string;
  description: string;
  video_url: string | null;
  status: "pending" | "accepted" | "rejected";
  resolved_exercise_id: string | null;
  resolution_note: string;
  requested_by: string;
};
type Person = { id: string; email: string | null; full_name: string };

const REQUEST_COLUMNS =
  "id, name, description, video_url, status, resolved_exercise_id, resolution_note, requested_by";

// Sends one email through Resend. Throws if Resend refuses it.
async function send(email: { to: string[]; subject: string; lines: string[]; replyTo?: string }) {
  const text = email.lines.join("\n\n");
  const html = email.lines.map((l) => `<p>${escape(l).replaceAll("\n", "<br>")}</p>`).join("");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: email.to, subject: email.subject, text, html, reply_to: email.replyTo }),
  });
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
}

async function people(ids: string[]): Promise<Map<string, Person>> {
  if (ids.length === 0) return new Map();
  const { data, error } = await db.from("profiles").select("id, email, full_name").in("id", ids);
  if (error) throw error;
  return new Map((data as Person[]).map((p) => [p.id, p]));
}

const who = (p: Person | undefined) => (p ? p.full_name || p.email || "Un entrenador" : "Un entrenador");

// New requests -> the superadmin(s).
async function sendNewRequests(): Promise<number> {
  const { data: admins, error: adminsError } = await db
    .from("profiles")
    .select("email")
    .eq("role", "superadmin")
    .is("disabled_at", null);
  if (adminsError) throw adminsError;
  const to = admins.map((a) => a.email).filter(Boolean) as string[];
  if (to.length === 0) return 0;

  // Claim them first (one update), so a call running at the same time skips them.
  const { data: claimed, error } = await db
    .from("exercise_requests")
    .update({ admin_notified_at: new Date().toISOString() })
    .is("admin_notified_at", null)
    .select(REQUEST_COLUMNS);
  if (error) throw error;

  const askers = await people([...new Set((claimed as Request[]).map((r) => r.requested_by))]);
  let sent = 0;
  for (const r of claimed as Request[]) {
    const asker = askers.get(r.requested_by);
    try {
      await send({
        to,
        replyTo: asker?.email ?? undefined,
        subject: `Pedido de ejercicio: ${r.name}`,
        lines: [
          `${who(asker)} pidió agregar "${r.name}" al catálogo.`,
          ...(r.description ? [r.description] : []),
          ...(r.video_url ? [`Video: ${r.video_url}`] : []),
          `Para responder: ${APP_URL}/#/pedidos`,
        ],
      });
      sent++;
    } catch (e) {
      console.error(e);
      // Not sent: unmark it so the next call tries again.
      await db.from("exercise_requests").update({ admin_notified_at: null }).eq("id", r.id);
    }
  }
  return sent;
}

// Answered requests -> the coach who asked.
async function sendAnswers(): Promise<number> {
  const { data: claimed, error } = await db
    .from("exercise_requests")
    .update({ requester_notified_at: new Date().toISOString() })
    .is("requester_notified_at", null)
    .neq("status", "pending")
    .select(REQUEST_COLUMNS);
  if (error) throw error;

  const askers = await people([...new Set((claimed as Request[]).map((r) => r.requested_by))]);
  let sent = 0;
  for (const r of claimed as Request[]) {
    const asker = askers.get(r.requested_by);
    if (!asker?.email) continue;
    const accepted = r.status === "accepted";
    try {
      await send({
        to: [asker.email],
        subject: accepted ? `Ya está en el catálogo: ${r.name}` : `Sobre tu pedido: ${r.name}`,
        lines: [
          accepted
            ? `Agregamos "${r.name}" al catálogo. Ya podés usarlo en tus rutinas.`
            : `No vamos a agregar "${r.name}" al catálogo.`,
          ...(r.resolution_note ? [r.resolution_note] : []),
          accepted ? `Verlo: ${APP_URL}/#/ejercicio/${r.resolved_exercise_id}` : `Tus pedidos: ${APP_URL}/#/pedidos`,
        ],
      });
      sent++;
    } catch (e) {
      console.error(e);
      await db.from("exercise_requests").update({ requester_notified_at: null }).eq("id", r.id);
    }
  }
  return sent;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  const { data } = token ? await db.auth.getUser(token) : { data: { user: null } };
  if (!data.user) return json({ error: "Hace falta iniciar sesión." }, 401);
  if (!RESEND_API_KEY) return json({ error: "Falta RESEND_API_KEY en los secretos de la función." }, 500);

  try {
    const newRequests = await sendNewRequests();
    const answers = await sendAnswers();
    return json({ newRequests, answers });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
