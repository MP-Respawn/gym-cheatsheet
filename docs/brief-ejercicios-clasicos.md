# Brief: ejercicios clásicos, cardio y estiramientos

Fecha: 2026-10-29 · Pedido por: Manu · Para: Claude Code en el repo `gym-cheatsheet`

## Objetivo

Sumar al catálogo de **Gimnasio** los ejercicios tradicionales que faltan, un grupo nuevo de **Cardio y acondicionamiento** y una serie de **estiramientos simples**. Son 62 ejercicios nuevos, en 4 tandas. El catálogo pasa de 168 a 230.

Cada tanda es un commit aparte, que se revisa en la app antes de seguir con la próxima.

## Decisiones ya tomadas (no reabrir)

1. **Grupo nuevo `cardio`** ("Cardio y acondicionamiento"), en `GROUPS` justo después de `movilidad`, porque el calentamiento y el cardio van al principio de la sesión. Es solo para la disciplina `gym`.
2. **Medida nueva `measure: "mins"`** para el cardio continuo. En el registro el cliente carga minutos. Se guarda en la columna `secs` que ya existe en `workout_sets` (minutos × 60). **Sin migración.**
3. Los estiramientos nuevos van al grupo `flexibilidad`, que ya existe, en la disciplina `gym`, con `measure: "secs"`.
4. Todos los ejercicios nuevos llevan `source: "added"`.
5. **No se tocan** los ejercicios existentes: ni sus `stretches`, ni sus `alternatives`, ni las vueltas de INCA.

## Alcance

- Tanda 1: 24 clásicos de fuerza y core.
- Tanda 2: la medida `mins`, el grupo `cardio` y 14 ejercicios de cardio.
- Tanda 3: 14 estiramientos.
- Tanda 4: 10 complementos de fuerza.
- Las animaciones de los 62 ejercicios.
- `npm run kb` al final de cada tanda, para que el asistente conozca el catálogo nuevo.

## Fuera de alcance

- Registrar distancia (km) o ritmo en cardio. Por ahora la intensidad va en el texto de la prescripción.
- Cambios en la base, en RLS o en las Edge Functions, salvo volver a desplegar `routine-assistant` con el catálogo nuevo.
- Cambiar el "Estirá después" de los ejercicios que ya existen.
- Disciplinas que no sean `gym`.

## Cómo escribir cada ejercicio

Seguí el estilo de los bloques que ya están en `src/data/exercises.js`. Las tablas de abajo fijan los datos duros: `id`, `name`, `group`, `secondary`, `pattern`, `equipment`, `measure`, `alternatives` y `prescription`. El resto lo escribís vos:

- `description`: una o dos oraciones. Qué es y qué trabaja.
- `cues`: de 2 a 4 indicaciones, en voseo imperativo ("bajá", "apretá"), con la misma voz que las existentes.
- `youtubeQuery`: búsqueda en castellano + "técnica".
- `stretches` (opcional, solo en los ejercicios nuevos de fuerza): de 1 a 3 ids de estiramientos que tengan sentido, nuevos o de yoga. Ejemplo: `curl-alternado` → `estiramiento-biceps`. Si la tanda 3 todavía no está hecha, dejalo para esa tanda.
- Ubicá cada bloque junto a los de su mismo grupo, no todos juntos al final.

Si una prescripción de la tabla te parece mal para el ejercicio, no la cambies: anotalo en el resumen del commit y lo decido yo.

## Animaciones

En la columna **Animación** de las tablas:

- **`from: <id>`**: no lleva archivo propio. Va `anim: { from: "<id>" }` en el ejercicio, y `bare: true` cuando dice `bare` (sin el equipamiento).
- **copiar `<id>`**: archivo nuevo `src/animations/exercises/<id-nuevo>.js` que parte de una copia del indicado y se ajusta (poses, timeline, textos de `say`, props).
- **nueva**: archivo desde cero. Las máquinas de cardio (cinta, bicicleta fija, elíptico, remo ergómetro, escaladora), el cajón, el banco romano y el peck deck necesitan props nuevos dibujados con `rect`, `line` y `path`, igual que el banco y el rack que ya existen.

Reglas:

- `anim.from` no puede apuntar a un ejercicio que a su vez reusa otro. `check-data` lo controla.
- `trote` reusa la animación de `trote-cinta` sin equipamiento, y `bicicleta` reusa la de `bicicleta-fija`. Hacé primero las dos de origen.
- `estiramiento-biceps` copia `estiramiento-pectoral`: hacé primero el pectoral.
- Usá `node scripts/figure-points.mjs <id>` para revisar que las articulaciones caigan donde corresponde.

## Cambios de código para la medida `mins` (tanda 2)

Archivos que seguramente toca:

- `src/data/exercises.js`: el grupo `cardio` en `GROUPS` y `mins` en el comentario de cabecera ("Shape of one exercise", campo `measure`).
- `src/store/workouts.js`: `setFields()` devuelve `["mins"]` para `measure: "mins"`. La conversión a `secs` (× 60) y de vuelta pasa en un solo lugar, en lo que se sube y se baja, no en cada pantalla.
- `src/screens/WorkoutLog.jsx`: `FIELD.mins = { unit: "min", inputMode: "numeric", label: "minutos" }`.
- El texto "Última vez: …" (`formatSets` o el helper que corresponda) y la vista de entrenamientos del cliente en el panel del coach (`TrainerClient.jsx`) muestran minutos, no segundos.
- `scripts/check-data.mjs`: acepta `"mins"` como `measure` válido.
- `supabase/functions/routine-assistant/prompts.ts` y el catálogo de `npm run kb`: revisá si mencionan los grupos o las medidas, y sumá `cardio` y `mins` donde haga falta.

## Tanda 1: clásicos de fuerza y core (24)

| # | id | Nombre | Grupo (secundarios) | Patrón | Equipo | Medida | Animación | Alternativas | Prescripción |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `elevaciones-frontales` | Elevaciones frontales con mancuernas | hombros | front-raise | mancuernas | kg + reps | copiar `vuelos-laterales` | `vuelos-laterales`, `press-militar-mancuernas` | 12 x 3 series |
| 2 | `vuelos-posteriores` | Vuelos posteriores (pájaros) | hombros (espalda) | rear-delt-fly | mancuernas, banco | kg + reps | copiar `vuelos-laterales` | `face-pull`, `remo-cruz` | 15 x 3 series |
| 3 | `remo-menton` | Remo al mentón | hombros | upright-row | barra, mancuernas | kg + reps | copiar `curl-barra` | `vuelos-laterales`, `vuelos-laterales-polea` | 10 x 3 series |
| 4 | `encogimientos-mancuernas` | Encogimientos de hombros con mancuernas | hombros (espalda) | shrug | mancuernas | kg + reps | nueva | `remo-menton` | 12 x 3 series |
| 5 | `curl-alternado` | Curl alternado con mancuernas | brazos | biceps-curl | mancuernas | kg + reps | `from: curl-martillo` | `curl-martillo`, `biceps-pared` | 10 por brazo x 3 series |
| 6 | `curl-concentrado` | Curl concentrado | brazos | biceps-curl | mancuerna, banco | kg + reps | copiar `curl-martillo` | `curl-alternado`, `curl-scott` | 10 por brazo x 3 series |
| 7 | `curl-scott` | Curl en banco Scott | brazos | biceps-curl | barra W, banco Scott | kg + reps | copiar `curl-barra` | `curl-concentrado`, `curl-barra` | 10 x 3 series |
| 8 | `press-frances` | Press francés con barra W | brazos | triceps-overhead | barra W, banco | kg + reps | copiar `press-plano-barra` | `triceps-trasnuca-polea`, `triceps-polea-soga` | 10 x 3 series |
| 9 | `triceps-polea-soga` | Tríceps en polea con soga | brazos | triceps-pushdown | polea, soga | kg + reps | copiar `triceps-polea-barra` | `triceps-polea-barra`, `patada-triceps` | 12 x 3 series |
| 10 | `patada-triceps` | Patada de tríceps con mancuerna | brazos | triceps-kickback | mancuerna, banco | kg + reps | copiar `remo-mancuerna` | `triceps-polea-soga`, `fondos-banco` | 12 por brazo x 3 series |
| 11 | `dominadas` | Dominadas | espalda (brazos) | pull-up | barra de dominadas | `reps` | copiar `dominadas-asistidas` | `dominadas-asistidas`, `jalon-pecho` | Al fallo técnico x 3 series |
| 12 | `hiperextensiones` | Hiperextensiones en banco romano | isquios (core, gluteos) | back-extension | banco romano | `reps` | nueva | `espinal-brazos-piernas`, `buenos-dias` | 15 x 3 series |
| 13 | `sentadilla-sin-peso` | Sentadilla sin peso | cuadriceps (gluteos) | squat | sin equipo | `reps` | `from: sentadilla-goblet, bare` | `sentadilla-goblet`, `sentadilla-pared` | 15 x 3 series |
| 14 | `estocada-atras` | Estocada hacia atrás | cuadriceps (gluteos) | lunge | mancuernas | kg + reps | copiar `estocadas` | `estocadas`, `sentadilla-bulgara` | 10 por pierna x 3 series |
| 15 | `subida-cajon` | Subida al cajón | cuadriceps (gluteos) | step-up | cajón, mancuernas | kg + reps | nueva | `estocada-atras`, `sentadilla-bulgara` | 10 por pierna x 3 series |
| 16 | `sentadilla-sumo` | Sentadilla sumo con mancuerna | cuadriceps (gluteos) | squat | mancuerna, pesa rusa | kg + reps | `from: sentadilla-goblet` | `sentadilla-goblet`, `maquina-aductores` | 12 x 3 series |
| 17 | `sentadilla-pared` | Sentadilla isométrica en la pared | cuadriceps | wall-sit | pared | `secs` | nueva | `camilla-cuadriceps-isometrica`, `sentadilla-sin-peso` | 30 a 45 seg x 3 series |
| 18 | `sentadilla-salto` | Sentadilla con salto | cuadriceps (cardio) | squat-jump | sin equipo | `reps` | copiar `sentadilla-goblet` | `sentadilla-sin-peso`, `burpees` | 10 x 3 series |
| 19 | `flexiones-rodillas` | Flexiones con rodillas apoyadas | pecho (brazos) | push-up | colchoneta | `reps` | copiar `flexiones` | `flexiones`, `press-plano-mancuernas` | 12 x 3 series |
| 20 | `peck-deck` | Peck deck (máquina de aperturas) | pecho | cable-fly | máquina | kg + reps | nueva | `aperturas-mancuernas`, `cruces-polea` | 12 x 3 series |
| 21 | `crunch-inverso` | Crunch inverso | core | leg-raise | colchoneta | `reps` | copiar `elevacion-piernas` | `elevacion-piernas`, `abdominal-bolita` | 15 x 3 series |
| 22 | `abdominal-bicicleta` | Abdominal bicicleta | core | crunch | colchoneta | `reps` | copiar `abdominal-cruzado` | `abdominal-cruzado`, `giros-rusos` | 20 (10 por lado) x 3 series |
| 23 | `escaladores` | Escaladores (mountain climbers) | core (cardio) | plank | colchoneta | `secs` | copiar `plancha-frontal` | `plancha-frontal`, `burpees` | 30 seg x 3 series |
| 24 | `giros-rusos` | Giros rusos | core | v-hold | colchoneta, disco, pelota medicinal | `reps` | copiar `plegado-en-v-torcido` | `plegado-en-v-torcido`, `abdominal-bicicleta` | 20 (10 por lado) x 3 series |

## Tanda 2: cardio y acondicionamiento (14 + medida `mins`)

Primero el grupo y la medida, después los ejercicios.

| # | id | Nombre | Grupo (secundarios) | Patrón | Equipo | Medida | Animación | Alternativas | Prescripción |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `caminata-cinta` | Caminata en cinta | cardio | walk | cinta | `mins` | nueva | `eliptico`, `bicicleta-fija` | 20 a 30 min a ritmo de conversación (podés subir la inclinación) |
| 2 | `trote-cinta` | Trote en cinta | cardio | run | cinta | `mins` | nueva | `trote`, `eliptico` | 20 a 30 min a ritmo cómodo |
| 3 | `trote` | Trote al aire libre | cardio | run | sin equipo | `mins` | `from: trote-cinta, bare` | `trote-cinta`, `bicicleta` | 20 a 40 min a ritmo cómodo |
| 4 | `bicicleta-fija` | Bicicleta fija | cardio | bike | bicicleta fija | `mins` | nueva | `eliptico`, `remo-ergometro` | 20 a 30 min, resistencia media |
| 5 | `bicicleta` | Bicicleta al aire libre | cardio | bike | bicicleta | `mins` | `from: bicicleta-fija` | `bicicleta-fija`, `trote` | 30 a 60 min a ritmo cómodo |
| 6 | `eliptico` | Elíptico | cardio | elliptical | elíptico | `mins` | nueva | `bicicleta-fija`, `caminata-cinta` | 20 a 30 min, resistencia media |
| 7 | `remo-ergometro` | Remo ergómetro | cardio (espalda) | rower | remo ergómetro | `mins` | nueva | `bicicleta-fija`, `eliptico` | 10 a 20 min a ritmo parejo |
| 8 | `escaladora` | Escaladora | cardio (gluteos) | stair | escaladora | `mins` | nueva | `subida-cajon`, `caminata-cinta` | 10 a 20 min a ritmo parejo |
| 9 | `saltar-soga` | Saltar la soga | cardio (gemelos) | jump-rope | soga de saltar | `secs` | nueva | `saltos-tijera`, `skipping` | 60 seg x 5 rondas, 30 seg de pausa |
| 10 | `burpees` | Burpees | cardio (pecho, cuadriceps) | burpee | sin equipo | `reps` | nueva | `escaladores`, `sentadilla-salto` | 10 x 4 series |
| 11 | `saltos-tijera` | Saltos de tijera (jumping jacks) | cardio | jumping-jack | sin equipo | `reps` | nueva | `saltar-soga`, `skipping` | 30 x 3 series |
| 12 | `skipping` | Skipping | cardio | run | sin equipo | `secs` | copiar `trote-cinta` | `saltos-tijera`, `escaladores` | 30 seg x 4 series |
| 13 | `cuerdas-batalla` | Cuerdas de batalla | cardio (hombros) | battle-rope | cuerdas de batalla | `secs` | nueva | `burpees`, `saltar-soga` | 30 seg x 5 rondas, 30 seg de pausa |
| 14 | `boxeo-sombra` | Boxeo de sombra | cardio (hombros) | shadow-boxing | sin equipo | `secs` | nueva | `saltar-soga`, `cuerdas-batalla` | 3 rounds de 2 min, 1 min de pausa |

## Tanda 3: estiramientos (14)

Todos en `gym`, grupo `flexibilidad`, `measure: "secs"`. Animación sostenida con un pulso lento, como las de yoga.

| # | id | Nombre | Grupo (secundarios) | Patrón | Equipo | Medida | Animación | Alternativas | Prescripción |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `estiramiento-cuadriceps` | Estiramiento de cuádriceps de pie | flexibilidad (cuadriceps) | stretch | sin equipo | `secs` | nueva | `yoga-heroe` | 30 seg por pierna |
| 2 | `estiramiento-isquios-pie` | Estiramiento de isquios de pie | flexibilidad (isquios) | stretch | escalón, banco | `secs` | nueva | `yoga-pinza-de-pie`, `estiramiento-isquios-banda` | 30 seg por pierna |
| 3 | `estiramiento-isquios-banda` | Estiramiento de isquios acostado con banda | flexibilidad (isquios) | stretch | banda elástica, colchoneta | `secs` | copiar `yoga-rodillas-al-pecho` | `yoga-pinza-sentada`, `estiramiento-isquios-pie` | 30 seg por pierna |
| 4 | `estiramiento-gemelos` | Estiramiento de gemelos en la pared | flexibilidad (gemelos) | stretch | pared | `secs` | copiar `tobillo-pared` | `yoga-perro-abajo` | 30 seg por pierna |
| 5 | `estiramiento-aductores` | Estiramiento de aductores de pie | flexibilidad (gluteos) | stretch | sin equipo | `secs` | copiar `estocadas-laterales` | `yoga-mariposa` | 30 seg por lado |
| 6 | `estiramiento-gluteo` | Estiramiento de glúteo acostado (figura 4) | flexibilidad (gluteos) | stretch | colchoneta | `secs` | copiar `yoga-rodillas-al-pecho` | `yoga-paloma` | 30 seg por lado |
| 7 | `estiramiento-pectoral` | Estiramiento de pectoral en la pared | flexibilidad (pecho) | stretch | pared | `secs` | nueva | `estiramiento-biceps` | 30 seg por lado |
| 8 | `estiramiento-biceps` | Estiramiento de bíceps en la pared | flexibilidad (brazos) | stretch | pared | `secs` | copiar `estiramiento-pectoral` | `estiramiento-pectoral` | 30 seg por brazo |
| 9 | `estiramiento-triceps` | Estiramiento de tríceps por detrás de la cabeza | flexibilidad (brazos) | stretch | sin equipo | `secs` | nueva | `estiramiento-hombro` | 30 seg por brazo |
| 10 | `estiramiento-hombro` | Estiramiento de hombro con brazo cruzado | flexibilidad (hombros) | stretch | sin equipo | `secs` | nueva | `estiramiento-triceps` | 30 seg por brazo |
| 11 | `estiramiento-espalda-alta` | Estiramiento de espalda alta | flexibilidad (espalda) | stretch | sin equipo | `secs` | nueva | `yoga-nino`, `colgado-barra` | 30 seg |
| 12 | `colgado-barra` | Colgado en la barra | flexibilidad (espalda, hombros) | hang | barra de dominadas | `secs` | copiar `elevacion-piernas-colgado` | `estiramiento-espalda-alta` | 20 a 40 seg x 3 |
| 13 | `estiramiento-cuello` | Estiramiento lateral de cuello | flexibilidad | stretch | sin equipo | `secs` | nueva | `estiramiento-hombro` | 20 seg por lado |
| 14 | `estiramiento-antebrazos` | Estiramiento de antebrazos y muñecas | flexibilidad (brazos) | stretch | sin equipo | `secs` | nueva | `af-movilidad-muneca` | 20 seg por posición |

## Tanda 4: complementos de fuerza (10)

| # | id | Nombre | Grupo (secundarios) | Patrón | Equipo | Medida | Animación | Alternativas | Prescripción |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `press-declinado-barra` | Press declinado con barra | pecho | bench-press | barra, banco declinado | kg + reps | copiar `press-plano-barra` | `fondos-paralelas`, `press-plano-barra` | 10 x 3 series |
| 2 | `press-pecho-maquina` | Press de pecho en máquina | pecho | bench-press | máquina | kg + reps | nueva | `press-plano-mancuernas`, `flexiones` | 12 x 3 series |
| 3 | `remo-invertido` | Remo invertido | espalda | row-horizontal | barra, smith, rack | `reps` | nueva | `remo-maquina`, `remo-polea-baja` | 12 x 3 series |
| 4 | `jalon-brazos-rectos` | Jalón con brazos rectos en polea | espalda | pullover | polea, barra corta, soga | kg + reps | copiar `jalon-pecho` | `pullover`, `jalon-pecho` | 12 x 3 series |
| 5 | `peso-muerto-sumo` | Peso muerto sumo | isquios (gluteos, cuadriceps) | hinge | barra | kg + reps | `from: peso-muerto` | `peso-muerto`, `sentadilla-sumo` | 6 a 8 x 4 series |
| 6 | `swing-pesa-rusa` | Swing con pesa rusa | gluteos (isquios, cardio) | hinge | pesa rusa | kg + reps | nueva | `peso-muerto-rumano-mancuernas`, `hip-thrust-mancuerna` | 15 x 4 series |
| 7 | `caminata-lateral-banda` | Caminata lateral con banda | gluteos | lateral-walk | banda elástica | `reps` | nueva | `clamshell-banda`, `maquina-abductores` | 15 pasos por lado x 3 series |
| 8 | `patada-gluteo-cuadrupedia` | Patada de glúteo en cuadrupedia | gluteos | single-leg-hinge | colchoneta, tobillera | `reps` | copiar `bird-dog` | `patada-gluteo-polea`, `jj-patada-burro` | 15 por pierna x 3 series |
| 9 | `pallof-press` | Pallof press | core | anti-rotation | polea, banda elástica | kg + reps | nueva | `plancha-lateral`, `bird-dog` | 10 por lado x 3 series |
| 10 | `caminata-granjero` | Caminata del granjero | core (brazos, hombros) | carry | mancuernas, pesa rusa | kg + reps | nueva | `encogimientos-mancuernas`, `plancha-frontal` | 3 tramos de 30 metros (reps = tramos) |

## Criterios de aceptación

1. `node scripts/check-data.mjs` pasa sin errores después de cada tanda.
2. `npm run lint` y `npm run build` pasan.
3. Cada ejercicio nuevo abre su página de detalle con su animación, sin cajas vacías. Revisalo en `npm run preview` y que no haya errores en la consola.
4. El chip "Cardio y acondicionamiento" aparece en Gimnasio, después de "Movilidad y calentamiento", y no aparece en Yoga, Animal Flow ni Jiu Jitsu.
5. La búsqueda encuentra los ejercicios nuevos por nombre y por equipo (por ejemplo "cinta", "soga", "pared").
6. **Medida `mins`:** en una rutina con "Trote en cinta", el registro muestra un solo casillero "min". Si cargás 25, la base guarda `secs = 1500`. "Última vez" dice 25 min, y el coach lo ve en minutos en la ficha del cliente.
7. Los ejercicios con `secs` y `reps` se registran igual que los isométricos y los abdominales que ya existen.
8. `npm run test:db` sigue pasando (no debería cambiar nada).
9. `npm run kb` corrido y el catálogo del asistente actualizado. En el resumen del commit, anotá que hay que volver a desplegar `routine-assistant`.
10. Ningún id existente cambió ni se borró.

## Cómo verificarlo (para Manu)

- En el teléfono, en la pestaña Ejercicios de Gimnasio: tocá el chip Cardio y abrí 3 ejercicios cualquiera de cada tanda.
- Armá una rutina de prueba con Trote en cinta + Sentadilla isométrica en la pared + Curl alternado y registrá un entrenamiento. Tienen que aparecer, en ese orden, los casilleros min, seg y kg + reps.
- Pedile al asistente, en modo Catálogo, "una rutina de cardio de 30 minutos": tiene que usar los ejercicios nuevos.

## Orden de trabajo

Una tanda por commit, en orden: 1 → 2 → 3 → 4. Al terminar cada una, mandá un resumen corto: qué agregaste, qué animaciones quedaron más flojas y cualquier prescripción que te haya hecho ruido.
