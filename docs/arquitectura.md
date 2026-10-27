# Arquitectura: de machete personal a plataforma entrenador → cliente

## Roles

- **SuperAdmin (vos)**: da de alta entrenadores, activa/desactiva usuarios, resuelve solicitudes de ejercicios.
- **Entrenador**: crea clientes, arma rutinas (plantillas), las asigna ajustando series/kg por cliente, ve lo que cada cliente registró, pide ejercicios nuevos.
- **Cliente**: entra por el link del entrenador + código por email, ve su rutina y el catálogo completo (solo lectura), registra kg/reps. No crea ni modifica rutinas.

## Vista general

```
        Vercel: una sola app React + Vite (PWA), tres áreas
   ┌──────────────┬──────────────────┬──────────────────┐
   │ cliente      │ panel entrenador │ panel superadmin │
   └──────┬───────┴────────┬─────────┴────────┬─────────┘
          │      supabase-js (JWT del usuario)│
          ▼                                   ▼
  Supabase: Auth (código por email) · Postgres + RLS · Edge Functions (emails)
```

Principios:
1. **La seguridad vive en la base (RLS).** Ocultar un botón es cosmética; lo que impide que un cliente edite una rutina es que Postgres rechaza la escritura.
2. **El catálogo sigue en código** (`src/data/exercises.js` + animaciones). La base guarda solo ids de ejercicio. Un id nunca se borra; los renombrados van a `src/data/renamedIds.js`.
3. **Una sola rutina, asignada con números propios.** La rutina es del coach; asignarla la vincula al cliente con sus propias series, reps y kg. Editarla le llega a todos los que la tienen, y cada uno conserva sus números. Si alguien necesita otros ejercicios, se duplica la rutina y se le asigna la copia.
4. **Registro offline-first.** La sesión activa se guarda en el teléfono y se sube con ids generados en el cliente (reintentar no duplica).
5. **Una sola codebase.** Si hace falta app nativa: Capacitor sobre la misma app.

## Modelo de datos

Ver `supabase/migrations/20261026000000_schema.sql` y `20261029000000_assignments.sql` (cada tabla está comentada).

| Tabla | Qué es |
|---|---|
| `profiles` | Un login. `role`: superadmin / trainer / client. `can_curate_catalog` para tu entrenador. `disabled_at` desactiva sin borrar. |
| `clients` | Un cliente de un entrenador. Existe **antes** de que la persona tenga cuenta (el entrenador lo crea, le asigna rutina y recién después manda el link); `user_id` se completa al aceptar. |
| `invitations` | Links de un solo uso (rol trainer o client). Se guarda el hash del token, nunca el token. Vencen a los 7 días. |
| `programs` | Rutinas del coach. |
| `program_days`, `program_steps` | Días y pasos. Un paso es uno o varios ejercicios (superserie) o una vuelta. Prescripción estructurada (`sets`, `reps`, `load_kg`, `secs`, `rest_sec`, `tempo`) + texto libre. |
| `program_assignments` | Rutina ↔ cliente. `archived_at` = se la quitaron. |
| `assignment_steps` | Las series, reps y kg propios de un cliente para un paso, solo donde difieren de la rutina. |
| `workout_sessions`, `workout_sets` | Registro del cliente. Cada serie guarda lo hecho y lo planificado en ese momento (`planned_*`). |
| `exercise_requests` | "Solicitar un ejercicio nuevo". |

Garantías a nivel base (no dependen de la app): una rutina solo puede asignarse a un cliente del mismo entrenador, una sesión solo puede registrar una rutina asignada a ese cliente, un paso es ejercicios **o** vuelta.

## Permisos

Ver `supabase/migrations/20261026000100_security.sql`.

| | Cliente | Entrenador | SuperAdmin |
|---|---|---|---|
| Perfiles | el suyo (solo el nombre) | los de sus clientes | todos |
| Clientes | su registro | los suyos (archivar, no borrar) | todos |
| Rutinas, días, pasos | **lee** las asignadas a él | todo sobre las suyas | todo |
| Asignaciones y números propios | **lee** los suyos | los de sus rutinas y clientes (quitar = archivar) | todo |
| Registro de entrenamientos | escribe el suyo | lee el de sus clientes | todo |
| Solicitudes de ejercicios | — | crea y ve las suyas | todas (también `can_curate_catalog`) |
| Invitaciones | — | links para sus clientes | links para entrenadores |

Funciones que llama la app (`supabase.rpc`): `create_client_invitation`, `create_trainer_invitation`, `revoke_invitation`, `accept_invitation`, `save_program` (guarda la rutina entera del constructor, todo o nada), `assign_program` (asigna a varios clientes, o cambia sus números, todo o nada), `save_workout_session`, `admin_update_profile`.

## Flujos

- **Alta de entrenador**: SuperAdmin genera link → el entrenador lo abre, entra con su email, `accept_invitation` lo vuelve entrenador.
- **Alta de cliente**: el entrenador crea el cliente, (opcional) le asigna rutina, genera link y lo manda por WhatsApp → el cliente entra con su email y queda vinculado.
- **Asignar**: rutina → elegir clientes → ajustar series/reps/kg por cliente → `assign_program`. Después se ajustan los números de un cliente con la misma pantalla.
- **Entrenar**: el cliente abre el día, registra series (pantalla actual de `WorkoutLog.jsx`), se guarda local y se sincroniza. El entrenador ve progreso.
- **Solicitar ejercicio**: el coach pide en Pedidos → email a vos (función + Resend) → lo agregan en código y se publica → en Pedidos, "Ya está" con el ejercicio → email al coach.

## Frontend

Hecho en la etapa 2:
- Todo pide cuenta. Login con código por email (sin contraseña); solo un link de invitación puede crear una cuenta nueva.
- `src/store/` habla con Supabase (`auth.js`, `remote.js`) y guarda una copia por cuenta en el teléfono (`storage.js`): la rutina abre sin señal y un entrenamiento se registra offline y se sube después con `save_workout_session` (todo o nada, reintentar no duplica).
- `RoutineList`, `RoutineDetail`, `ProgramDetail` y `WorkoutLog` muestran las rutinas asignadas, convertidas a la forma de siempre por `assigned.js`. Las secuencias del catálogo (vueltas, Flow básico, yoga, Jiu Jitsu) siguen en el código.
- Se quitaron las rutinas propias, el editor y la copia de seguridad local. El editor (`src/screens/RoutineEditor.jsx` y `src/components/ExercisePicker.jsx`) está en el historial de git para reusarlo como constructor del entrenador en la etapa 3.
- `scripts/seed-trainer.mjs` importa Bloque A y B como plantillas de un entrenador, se las asigna a un cliente e imprime su link.

Hecho en la etapa 3 (panel del entrenador, en la misma app):
- Un coach ve una pestaña más, **Clientes**, y en **Rutinas** arriba de todo sus rutinas (con quién las tiene, Editar, Duplicar, Asignar). No hay plantillas aparte: una rutina se arma una vez y se asigna. El hash router alcanzó; las páginas del coach solo se muestran a ese rol (la base igual rechaza lo demás).
- Clientes: alta con nombre y email opcional, link de invitación para copiar o mandar por WhatsApp, estado (activo, pendiente, vencido), ficha con sus rutinas (series y kilos propios, editar la rutina, quitar, devolver, asignar otra, armar una nueva que queda asignada) y sus entrenamientos con lo planificado al lado.
- El constructor (el editor de la etapa 1, recuperado del historial): series, reps, kg y pausa por paso, vueltas completas como paso, duplicar, y guardado de toda la rutina en una llamada (`save_program`: todo o nada, los ids se conservan para que el historial y los números de cada cliente sigan apuntando al paso).
- Asignar: elegir clientes y una grilla con series/reps/kg de cada uno, empezando por los que tiene cada uno; viaja solo lo que difiere de la rutina (`assign_program` con overrides, que reemplazan los anteriores).
- `src/store/trainer.js` lee en vivo (el entrenador tiene señal) con una caché compartida entre pantallas.

Hecho en la etapa 4 (SuperAdmin y pedidos de ejercicios):
- Vos ves una pestaña **Coaches**: invitar un coach con un link de un solo uso (copiar o WhatsApp; quien lo abre y entra con su email queda como coach), anular links sin usar, ver cuántos clientes tiene cada uno, desactivarlo (conserva sus datos; sus clientes siguen viendo sus rutinas) y elegir quién responde pedidos con vos (`can_curate_catalog`).
- Todo coach ve **Pedidos**: pide un ejercicio que falta (nombre, cómo se hace, link a un video; desde la búsqueda sin resultados llega con el nombre escrito) y ve la respuesta. Vos y el coach que cura el catálogo ven además "Por responder": cuando el ejercicio ya está en el código, "Ya está" lo elige del catálogo; si no, "No lo agregamos". Las dos con una nota.
- Emails con Resend desde la función `supabase/functions/exercise-request-email`: un pedido nuevo te llega a vos (responder el email le contesta al coach) y la respuesta le llega al coach. La app la llama después de pedir y de responder, pero la función no recibe datos: manda lo que todavía no se mandó (`admin_notified_at`, `requester_notified_at`) y lo marca, así que nunca manda dos veces ni sirve para mandar otra cosa.
- La base completa quién respondió y cuándo; un "aceptado" exige el id del ejercicio.

Hecho en la etapa 5 (app instalable, sin tiendas):
- Es una PWA: se agrega a la pantalla de inicio desde el navegador (Android: "Instalar la app"; iPhone: Safari → Compartir → Agregar a inicio, la app lo explica) y abre a pantalla completa. No pasa por Play Store ni App Store; si algún día hace falta, el mismo código se puede publicar ahí.
- `vite-plugin-pwa` genera el manifest y el service worker, que guarda la app entera en el teléfono (código, estilos, fuentes, íconos): abre sin señal. Los datos no pasan por ahí: la rutina y el registro los guarda `storage.js`, y los pedidos a Supabase van siempre a la red.
- Las fuentes vienen con la app (`@fontsource`), no de Google. Los íconos salen de `public/icon.svg` (`npm run icons`).
- Abrir sin señal con el token vencido ya no te saca de la cuenta (`auth.js`), y la app le pide al navegador que no borre lo guardado.
- Una versión nueva se baja sola y espera: "Hay una versión nueva · Actualizar", o entra la próxima vez que se abre. Nunca recarga en medio de un entrenamiento.
- Las pantallas del coach y del superadmin se cargan aparte: un cliente baja menos código.

Temas (después de la etapa 5):
- En el menú, **Tema**: Oscuro (el original), Claro (Respawn en claro, tarjetas blancas con contorno) e INCA (la marca de INCA MMA según su manual: fondo Hueso, texto Noche, Gris Inca, Oro Inti en botones con texto Noche, Oro Viejo para texto dorado; Archivo expandido en títulos e IBM Plex Mono en etiquetas; la barra de navegación en Noche con el activo en oro).
- Se guarda en cada teléfono (`src/store/theme.js`) y se aplica antes de pintar (`index.html`), así no parpadea. Un tema es solo otra lista de valores para las variables de `styles.css`; las animaciones también las usan.
- Las fuentes de INCA no se guardan de entrada para usar sin señal: se guardan la primera vez que alguien elige ese tema.
- La marca en INCA: el isotipo (la corona en su círculo) con "INCA MMA" en la barra y el menú, y el sello completo en el inicio de sesión. Las dos imágenes (`public/brand/inca-isotipo.png`, `inca-sello.png`) están recortadas del manual de marca v1.0; se reemplazan cuando haya un SVG del logo.
- En Ejercicios, el título sigue a la pestaña ("Ejercicios de yoga", con el número al lado) y "↳ GRUPO" marca los chips como subcategoría de la disciplina.

Pendiente:
- Gráficos de progreso por ejercicio.
- Que un coach pueda fijar el tema de sus clientes (hoy cada uno lo elige).

## Operación

- Migraciones versionadas en `supabase/migrations/`; nada se cambia a mano en producción.
- Dos proyectos Supabase: staging (previews de Vercel) y producción.
- `npm run test:db` corre los tests de permisos en PGlite (sin Docker); `supabase test db` corre los mismos contra Supabase local.
- Backups diarios + PITR, Sentry, rate limit de invitaciones y códigos, política de privacidad y borrado de cuenta.

## Etapas

1. **Base** ✅ esquema, permisos, invitaciones y asignación, con tests.
2. **Cliente** ✅ login por invitación, rutina asignada desde la base, catálogo de solo lectura, registro sincronizado.
3. **Panel entrenador** ✅ clientes, constructor de rutinas, asignación con números por cliente, historial.
4. **Panel SuperAdmin** ✅ coaches (invitar, desactivar, quién cura el catálogo) y pedidos de ejercicios con emails.
5. **PWA offline + pulido** ✅ instalable desde el navegador, abre sin señal, avisa versiones nuevas. Después: textos y definiciones del catálogo.
