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
3. **Asignar = copiar.** Asignar una plantilla crea una copia del cliente con sus propios valores. Editar la plantilla no cambia lo que el cliente ya tiene.
4. **Registro offline-first.** La sesión activa se guarda en el teléfono y se sube con ids generados en el cliente (reintentar no duplica).
5. **Una sola codebase.** Si hace falta app nativa: Capacitor sobre la misma app.

## Modelo de datos

Ver `supabase/migrations/20261026000000_schema.sql` (cada tabla está comentada).

| Tabla | Qué es |
|---|---|
| `profiles` | Un login. `role`: superadmin / trainer / client. `can_curate_catalog` para tu entrenador. `disabled_at` desactiva sin borrar. |
| `clients` | Un cliente de un entrenador. Existe **antes** de que la persona tenga cuenta (el entrenador lo crea, le asigna rutina y recién después manda el link); `user_id` se completa al aceptar. |
| `invitations` | Links de un solo uso (rol trainer o client). Se guarda el hash del token, nunca el token. Vencen a los 7 días. |
| `programs` | Rutinas. `client_id` vacío = plantilla del entrenador; con `client_id` = copia asignada a ese cliente. |
| `program_days`, `program_steps` | Días y pasos. Un paso es uno o varios ejercicios (superserie) o una vuelta. Prescripción estructurada (`sets`, `reps`, `load_kg`, `secs`, `rest_sec`, `tempo`) + texto libre. |
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
| Registro de entrenamientos | escribe el suyo | lee el de sus clientes | todo |
| Solicitudes de ejercicios | — | crea y ve las suyas | todas (también `can_curate_catalog`) |
| Invitaciones | — | links para sus clientes | links para entrenadores |

Funciones que llama la app (`supabase.rpc`): `create_client_invitation`, `create_trainer_invitation`, `revoke_invitation`, `accept_invitation`, `assign_program` (copia a varios clientes con valores por cliente, todo o nada), `admin_update_profile`.

## Flujos

- **Alta de entrenador**: SuperAdmin genera link → el entrenador lo abre, entra con su email, `accept_invitation` lo vuelve entrenador.
- **Alta de cliente**: el entrenador crea el cliente, (opcional) le asigna rutina, genera link y lo manda por WhatsApp → el cliente entra con su email y queda vinculado.
- **Asignar**: plantilla → elegir clientes → ajustar series/kg por cliente → `assign_program`.
- **Entrenar**: el cliente abre el día, registra series (pantalla actual de `WorkoutLog.jsx`), se guarda local y se sincroniza. El entrenador ve progreso.
- **Solicitar ejercicio**: el entrenador pide → email a vos (Edge Function + Resend) → lo agregan en código → lo marcan `accepted` con el id nuevo.

## Frontend (próximas etapas)

- `@supabase/supabase-js` + TanStack Query; router con rutas por rol (el hash router actual no escala a tres áreas).
- `src/store/` pasa a hablar con Supabase; `storage.js` queda como caché/cola offline.
- Se reutilizan `ExerciseList`, `ExerciseDetail`, `Search` y las animaciones para todos; `RoutineDetail`/`ProgramDetail` para el cliente; `RoutineEditor` se vuelve el constructor del entrenador; `WorkoutLog` sirve al cliente y, en lectura, al entrenador.
- `src/data/routines.js` se importa como plantillas de tu entrenador con un script de seed.
- PWA instalable con catálogo y rutina asignada offline.

## Operación

- Migraciones versionadas en `supabase/migrations/`; nada se cambia a mano en producción.
- Dos proyectos Supabase: staging (previews de Vercel) y producción.
- `npm run test:db` corre los tests de permisos en PGlite (sin Docker); `supabase test db` corre los mismos contra Supabase local.
- Backups diarios + PITR, Sentry, rate limit de invitaciones y códigos, política de privacidad y borrado de cuenta.

## Etapas

1. **Base** ✅ esquema, permisos, invitaciones y asignación, con tests.
2. **Cliente**: login por invitación, rutina asignada desde la base, catálogo de solo lectura, registro sincronizado.
3. **Panel entrenador**: clientes, constructor de plantillas, asignación con ajuste por cliente, progreso.
4. **Panel SuperAdmin**: entrenadores y solicitudes de ejercicios con emails.
5. **PWA offline + pulido**; después, textos y definiciones del catálogo.
