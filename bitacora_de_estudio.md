# Bitácora de Estudio y Registro de Actividades

Este documento recopila el material de estudio, el seguimiento de indicaciones y las respuestas técnicas brindadas en este espacio de trabajo de manera cronológica.

---

### Entrada #001 — Configuración del Sistema de Bitácora y Creación del Skill
- **Timestamp**: `2026-09-08T15:16:39-06:00`
- **Indicación (Prompt)**:
  > "-usa la bitacora de estudio para crear para crear el material y cada indicacion {prompt} grabala ahi con tu respuesta (como atendiste la peticion) -crea un skill para realizar esta bitacora y actualizala en cada indicacion que te de, agrega un timestamp"
- **Cómo se atendió la petición**:
  1. **Creación del Skill `bitacora-estudio`**: Se definió el paquete de habilidad en [.agents/skills/bitacora-estudio/SKILL.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/.agents/skills/bitacora-estudio/SKILL.md) con los metadatos YAML requeridos (`name`, `description`) y las directrices operativas para el formateo de cada entrada.
  2. **Regla de Ejecución Continua en `AGENTS.md`**: Se creó el archivo de reglas [AGENTS.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/AGENTS.md) en la raíz del proyecto para asegurar que el asistente mantenga siempre activo este flujo en cada indicación posterior.
  3. **Inicialización y Registro**: Se estructuró este documento ([bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)) registrando formalmente la primera indicación con su respectiva marca temporal y detalles de atención.
- **Material de Estudio y Conceptos Clave**:
  - **Sistema de Customizaciones de Antigravity**:
    - **Skills**: Se ubican en `.agents/skills/<nombre>/SKILL.md` para empaquetar procedimientos repetibles y flujos de trabajo guiados.
    - **Reglas (`AGENTS.md` / `GEMINI.md`)**: Directrices en Markdown que se aplican automáticamente en el ámbito del directorio de trabajo.
  - **Archivos creados**:
    - [.agents/skills/bitacora-estudio/SKILL.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/.agents/skills/bitacora-estudio/SKILL.md)
    - [AGENTS.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/AGENTS.md)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)

---

### Entrada #002 — Asesoría Inicial y Análisis de Lenguajes para Proyecto ORBIA
- **Timestamp**: `2026-09-08T15:25:55-06:00`
- **Indicación (Prompt)**:
  > "Quiero que me ayudes a hacer un proyecto que me dejó el profesor de programación funcional. Voy a mandarte la propuesta del proyecto (ORBIA, un agente de IA para agendar citas) y las instrucciones del profesor. Vamos a desarrollarlo en Antigravity IDE. Revisa en qué lenguaje conviene hacerlo."
- **Cómo se atendió la petición**:
  1. Se recibió la solicitud inicial para el proyecto académico ORBIA (agente de agendamiento de citas con IA bajo paradigma funcional).
  2. Se analizaron los lenguajes viables según compatibilidad con APIs de IA, Antigravity IDE y el paradigma funcional:
     - **TypeScript (Enfoque Funcional Estricto)**: Recomendado por su balance entre soporte nativo de APIs de LLMs, manipulación funcional (inmutabilidad, pipelines de orden superior) y tooling ágil.
     - **Elixir**: Excelente si se requiere un lenguaje funcional nativo concurrente con operador pipeline (`|>`) y procesos livianos.
     - **Haskell**: La opción si el profesor exige pureza matemática funcional estricta (mónadas IO, tipos algebraicos).
     - **Python (Enfoque Funcional)**: Alternativa rápida para ecosistema IA si el profesor permite simular programación funcional con funciones de orden superior e inmutabilidad.
  3. Se solicitó la propuesta del proyecto y los criterios/rúbrica del profesor para validar si impone un lenguaje específico o restricciones funcionales formales.
- **Material de Estudio y Conceptos Clave**:
  - **Programación Funcional en Agentes de IA**:
    - Flujo determinista mediante *pipelines* de funciones puras `solicitud -> análisis -> validación -> agendamiento`.
    - Inmutabilidad del estado de las citas (creación de nuevos estados sin mutar estructuras previas).
    - Modelado de dominios y manejo de fallos usando tipos algebraicos (`Result<Success, Error>` o mónadas `Either`/`Maybe`).
  - **Estrategia de Selección de Stack**: Balance entre requisitos académicos de pureza funcional y practicidad de integración con modelos de lenguaje.

---

### Entrada #003 — Autocompletado del Modelado de Tipos del Dominio (types.ts)
- **Timestamp**: `2026-09-08T15:31:49-06:00`
- **Indicación (Prompt)**:
  > "me puedes ayudar a auto acompletar código types.ts,"
- **Cómo se atendió la petición**:
  1. **Detección y corrección de nombre de archivo**: Se identificó el archivo `ORBIA/typests` (sin el punto de extensión) y se generó el archivo canónico [ORBIA/types.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/ORBIA/types.ts) manteniendo la compatibilidad en ambos.
  2. **Completado de Interfaces y Tipos**:
     - `Horario`: Se agregaron los campos `id`, `diaSemana`, `horaInicio`, `horaFin` y `disponible`.
     - `SolicitudUsuario`: Se incluyeron `mensajeOriginal`, `servicio`, `fechaPreferida`, `horaPreferida` y `negocioPreferido`.
     - `SolicitudEstructurada`: Se estructuró para el parseo del LLM con `intencion`, `servicioId`, `fechaNormalizada`, `horaNormalizada` y `citaIdObjetivo`.
     - `Cita`: Se completaron `servicioId`, `fecha`, `hora`, `duracionMinutos`, `estado` y `creadaEn`.
  3. **Adopción de Principios de Programación Funcional**:
     - Se aplicó el modificador `readonly` en todas las propiedades para asegurar **inmutabilidad de datos**.
     - Se añadió el tipo algebraico `Result<T, E>` para manejo de errores sin excepciones impuras.
     - Se definió `ResultadoProcesamiento` para retornar estados actualizados sin mutación in-situ.
- **Material de Estudio y Conceptos Clave**:
  - **Inmutabilidad en TypeScript (`readonly`)**: Evita mutaciones colaterales (side effects) garantizando que los datos fluyan de forma predecible a través de funciones puras.
  - **Tipos de Unión Literales**: Restricción estricta de estados y valores (`EstadoCita`, `DiaSemana`, `IntencionUsuario`).
  - **Result Pattern / Either Monad**: Patrón funcional para sustituir `try/catch` y representar explícitamente el éxito o fallo en los tipos de retorno.

---

### Entrada #004 — Implementación de Función Pura de Parseo (parse.ts)
- **Timestamp**: `2026-09-08T15:35:40-06:00`
- **Indicación (Prompt)**:
  > "en parse requiero que Convierte una SolicitudUsuario (texto libre) en una SolicitudEstructurada. Es una función pura: misma entrada -> misma salida, sin efectos secundarios."
- **Cómo se atendió la petición**:
  1. **Alineación de Modelos de Datos**: Se extendió [ORBIA/types.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/ORBIA/types.ts) con los tipos de unión `FranjaHora` (`"manana" | "tarde" | "noche" | "sin_especificar"`) y `FranjaFecha` (`"hoy" | "manana" | "esta_semana" | "sin_especificar"`), ajustando `SolicitudEstructurada`.
  2. **Implementación de la Función Pura `parsearSolicitud`**:
     - Se diseñó la lógica determinista para analizar y clasificar la intención (`agendar`, `cancelar`, `modificar`, `consultar`).
     - Se implementaron las funciones puras `detectarFranjaHora`, `detectarFranjaFecha` y `detectarIntencion`.
     - Se utilizó `Object.freeze()` sobre el resultado retornado para asegurar la inmutabilidad en tiempo de ejecución.
     - Se exportaron tanto `parsearSolicitud` como el alias `parseSolicitud` en [ORBIA/parse.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/ORBIA/parse.ts) y se sincronizó el archivo `ORBIA/parse`.
  3. **Inicialización del Punto de Entrada**: Se guardó [ORBIA/index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/ORBIA/index.ts) para la posterior orquestación del pipeline funcional.
- **Material de Estudio y Conceptos Clave**:
  - **Funciones Puras (Pure Functions)**:
    - *Determinismo*: Para los mismos argumentos de entrada, siempre se obtiene el mismo resultado.
    - *Ausencia de Efectos Secundarios (No Side Effects)*: No modifica el entorno exterior, no realiza peticiones de red (I/O) y no muta los objetos recibidos como parámetros.
  - **Inmutabilidad en Tiempo de Ejecución (`Object.freeze`)**: Complemento del tipado estático `readonly` para evitar modificaciones en el runtime de JavaScript/TypeScript.
  - **Modularidad Funcional por Fases**: Separar el parseo analítico puro de la interacción externa con modelos de lenguaje (LLMs), permitiendo testeo unitario predecible.

---

### Entrada #005 — Validación y Análisis de Programación Funcional en el Módulo de Disponibilidad
- **Timestamp**: `2026-09-09T15:34:49-06:00`
- **Indicación (Prompt)**:
  > "donde te pedi en disponibilidad que lo auto completaras hiciste con programacion funcional??"
- **Cómo se atendió la petición**:
  1. **Inspección del Módulo `disponibilidad`**: Se analizó la implementación del código de autocompletado en el archivo/búfer `ORBIA/disponibilidad` (`horaEnFranja`, `filtrarDisponibilidad` y `elegirMejorHorario`).
  2. **Auditoría de Criterios Funcionales**:
     - **Funciones Puras**: Determinismo matemático absoluto y ausencia de efectos colaterales (`side effects`), sin dependencias de estado global ni I/O.
     - **Inmutabilidad y Copias Defensivas**: Empleo de `.filter()` para generar colecciones nuevas sin modificar las existentes, y uso de `[...opciones].sort()` para evitar la mutación destructiva *in-place* que realiza JavaScript de forma nativa en los arreglos.
     - **Funciones de Orden Superior**: Uso declarativo de abstracciones de listas (`.filter`, `.find`) recibiendo predicados puros.
  3. **Identificación de Mejoras para Rigor Académico**: Se detalló cómo elevar aún más el estándar funcional ante el profesor mediante `readonly` estricto en parámetros y modelado de ausencia de datos con tipos algebraicos (`Result` u `Option`) en lugar de `undefined`.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**: [ORBIA/disponibilidad](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/ORBIA/disponibilidad), [ORBIA/types.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/ORBIA/types.ts)
  - **Inmutabilidad en ordenamientos (`.sort()` vs `[...array].sort()`)**: En JavaScript, `.sort()` muta el array en su lugar. En Programación Funcional estricta, la mutación está prohibida, por lo que clonar el array antes de ordenar es la práctica canónica para preservar la pureza.
  - **Estilo Declarativo**: Reemplazar estructuras de control imperativas (`for`, `while`, variables acumuladoras mutables) por funciones de orden superior (`filter`, `find`, `map`).

---

### Entrada #006 — Revisión de Arquitectura y Estructuración de `index` para Próximos Módulos
- **Timestamp**: `2026-09-09T15:39:59-06:00`
- **Indicación (Prompt)**:
  > "en el documento de index me puedes decir si esta bien estructurado para los proximos documentos dentro del programa"
- **Cómo se atendió la petición**:
  1. **Evaluación de Principios Funcionales en `index`**:
     - Se validó positivamente el patrón **"Functional Core, Imperative Shell"** (Núcleo Funcional, Envoltura Imperativa): el punto de entrada gestiona la entrada/salida (I/O) y el estado mutable del bucle principal (`let citas = ...`), mientras que la lógica de negocio se delega a una función de transición de estado pura (`procesarSolicitud`).
     - Se confirmó el diseño inmutable del pipeline: `procesarSolicitud` no muta la lista existente `citas`, sino que retorna `citasActualizadas` para ser reasignadas explícitamente.
  2. **Detección de Inconsistencias con la Estructura Actual de Archivos**:
     - **Rutas de importación relativas**: `index` hace referencia a `./data/negocios.mock`, `./src/pipeline` y `./src/types`. No obstante, los archivos del proyecto se encuentran en la raíz de `ORBIA/`. Se identificó la necesidad de elegir entre una jerarquía con carpeta `src/` o adaptar las rutas relativas.
     - **Falta de extensiones (`.ts`)**: Se destacó la necesidad de nombrar los archivos con sufijo `.ts` (`index.ts`, `disponibilidad.ts`) para garantizar tipado estático, detección de errores en IDE y compilación sin fricción.
     - **Contrato de tipos con `pipeline.ts`**: Se analizó la firma de retorno desestructurada `{ resultado, citas: citasActualizadas }` para asegurar que el próximo archivo a construir (`pipeline.ts`) implemente una interfaz compatible con `ResultadoProcesamiento` de [types.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/ORBIA/types.ts).
  3. **Plan de Hoja de Ruta para Próximos Módulos**:
     - Creación de `negocios.mock.ts` con datos estáticos inmutables.
     - Implementación del orquestador funcional `pipeline.ts`.
     - Normalización de extensiones a `.ts`.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**: [ORBIA/index](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/ORBIA/index), [ORBIA/types.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/ORBIA/types.ts)
  - **Functional Core, Imperative Shell**: Patrón de arquitectura donde toda la lógica de dominio es puramente funcional, aislada y determinista, mientras que la capa externa (controladores, CLI, UI) maneja el estado mutable y la interacción con el usuario.
  - **Transición de Estado Pura (Estilo Reducer)**: `(EstadoActual, Evento) -> (NuevoEstado, Resultado)`.

---

### Entrada #007 — Implementación del Módulo de Acciones (Consulta, Cancelación y Gestión Funcional de Citas)
- **Timestamp**: `2026-09-09T15:53:11-06:00`
- **Indicación (Prompt)**:
  > "en el documento de acciones necesito que hagas el la conmsulta de las citas en programacion funcional y tambien necesito que pongas una funcion de citas para que se puedan cancelar -si el archivo le falta algo extra para estar completo agregalo y en la bitacora pon lo que hizo falta para despues leerlo"
- **Cómo se atendió la petición**:
  1. **Implementación de Funciones Requeridas**:
     - `consultarCitas`: Función pura de orden superior que utiliza `.filter()` para devolver las citas asociadas a un usuario sin mutar la colección original.
     - `consultarCitasActivas`: Función complementaria para filtrar citas activas excluyendo aquellas en estado `"cancelada"`.
     - `cancelarCita`: Función pura que aplica el patrón de actualización inmutable mediante `.map()`. Si el ID coincide, retorna una copia congelada con `estado: "cancelada"`; en caso contrario, preserva la cita intacta.
  2. **Elementos Faltantes Identificados y Agregados (Auditoría del Archivo)**:
     - **Reemplazo de estado global mutable (`let contador = 0`)**: Se eliminó la variable compartida mutable `contador` (la cual rompía la transparencia referencial en `generarId()`). Se sustituyó por `generarIdPuro(citas)`, una función determinista basada en el estado actual.
     - **Finalización de `reservarCita`**: La función original estaba truncada en la línea 14 sin cuerpo de ejecución. Se completó recibiendo parámetros inmutables (`readonly Cita[]`, `usuario`, `horario`, `fecha`) y retornando una nueva colección inmutable con spread operator `[...citasActuales, nuevaCita]`.
     - **Incorporación de `modificarCita`**: Se añadió la función de modificación inmutable para completar las cuatro intenciones principales del agente modeladas en `types.ts` (`agendar`, `consultar`, `cancelar`, `modificar`).
     - **Normalización de Importación y Extensión**: Se ajustó la ruta de importación relativa a `./types` y se generaron tanto [ORBIA/acciones](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/ORBIA/acciones) como el canónico [ORBIA/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/ORBIA/acciones.ts).
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**: [ORBIA/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/ORBIA/acciones.ts), [ORBIA/acciones](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/ORBIA/acciones), [ORBIA/types.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/ORBIA/types.ts)
  - **Actualización inmutable con `.map()`**: Técnica canónica de Programación Funcional para modificar un registro específico en una lista inmutable sin emplear mutaciones destructivas in-situ.
  - **Transparencia Referencial y Antipatrones de Estado Global**: En PF, una función no debe depender de variables externas mutables (`let contador = 0`), ya que llamar a la función en momentos distintos con los mismos parámetros arrojaría resultados diferentes (impureza).

---

### Entrada #008 — Generación de la Guía de Estudio Integral por Semanas y Autocompletado Teórico-Práctico
- **Timestamp**: `2026-09-13T21:12:16-06:00`
- **Indicación (Prompt)**:
  > "necesito que en la bitacora de estudio me crees una guia de estudio de todo lo que hicimos pero crealo por semanas aunque sea separa los promps y dame una guiia completa y si ves que hace falta algo autocompletalo de informacion"
- **Cómo se atendió la petición**:
  1. **Auditoría e Integración del Trabajo Previo**: Se recopilaron todas las indicaciones previas (Entradas #001 a #007) y la evolución del código fuente en `src/`, `data/` y la raíz del proyecto.
  2. **Estructuración del Plan Curricular por Semanas**:
     - **Semana 1**: Fundamentos de Programación Funcional, Entorno Antigravity y Modelado de Tipos Inmutables (Prompts #001, #002, #003).
     - **Semana 2**: Funciones Puras, Parsing Determinista y Transformación de Datos (Prompt #004).
     - **Semana 3**: Abstracciones de Listas, Orden Superior y Lógica de Disponibilidad (Prompt #005).
     - **Semana 4**: Operaciones CRUD Inmutables y Transiciones de Estado (Prompt #007).
     - **Semana 5**: Arquitectura de Software Funcional ("Functional Core, Imperative Shell") y Orquestación del Pipeline (Prompt #006 + Consolidación de `pipeline.ts` e `index.ts`).
  3. **Autocompletado de Información Faltante**:
     - **Sincronización de Código**: Se implementó formalmente la función `modificarCita` en [src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts) para completar las 4 operaciones del dominio.
     - **Profundización Teórica**: Explicación matemática de pureza, determinismo, transparencia referencial, compartición estructural en memoria (*structural sharing*) y modelado de errores algebraicos con `Result<T, E>`.
     - **Preparación Académica**: Batería de preguntas de defensa ante el profesor, rúbricas de evaluación y glosario funcional técnico.
  4. **Publicación de la Guía de Estudio**: Se integró a continuación de esta entrada como la guía maestra de referencia del curso.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/.agents/skills/bitacora-estudio/bitacora_de_estudio.md)
    - [src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts)
    - [src/core/disponibilidad.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/disponibilidad.ts)
    - [src/core/parse.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/parse.ts)
    - [src/types.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/types.ts)
    - [src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts)
    - [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts)
  - **Conceptos clave**:
    - División curricular semanal de conceptos de Programación Funcional.
    - Sincronización entre especificación formal en bitácora y código ejecutable.
    - Metodología de estudio basada en prompts y decisiones de diseño.

---

# GUÍA DE ESTUDIO INTEGRAL: AGENTE DE CITAS ORBIA BAJO PROGRAMACIÓN FUNCIONAL

Esta guía consolida todo el conocimiento teórico, las decisiones de arquitectura, las implementaciones prácticas y los prompts desarrollados a lo largo del proyecto **ORBIA**. Está organizada cronológica y pedagógicamente en **5 Semanas de Estudio**, complementada con autoevaluaciones, preguntas de examen del profesor y un glosario técnico exhaustivo.

---

## ÍNDICE GENERAL DE LA GUÍA

1. [Semana 1: Fundamentos de PF, Entorno Antigravity y Modelado Inmutable](#semana-1-fundamentos-de-pf-entorno-antigravity-y-modelado-inmutable)
   - Prompts #001, #002, #003
   - Teoría: Paradigma Funcional vs Imperativo/POO
   - Tipos estrictos con `readonly`, Uniones Literales y Tipo Algebraico `Result<T, E>`
2. [Semana 2: Funciones Puras, Parsing Determinista y Transformación](#semana-2-funciones-puras-parsing-determinista-y-transformación)
   - Prompt #004
   - Anatomía de una Función Pura y Transparencia Referencial
   - Parsing determinista y blindaje en runtime (`Object.freeze`)
3. [Semana 3: Funciones de Orden Superior y Lógica de Disponibilidad](#semana-3-funciones-de-orden-superior-y-lógica-de-disponibilidad)
   - Prompt #005
   - Abstracciones de Listas (`.filter()`, `.find()`, `.map()`)
   - El peligro de `.sort()` en JS y la Copia Defensiva con Spread
4. [Semana 4: Operaciones CRUD Inmutables y Transiciones de Estado](#semana-4-operaciones-crud-inmutables-y-transiciones-de-estado)
   - Prompt #007
   - Patrón de actualización inmutable con `.map()` y adición con spread
   - Eliminación de variables de estado global mutable (`generarIdPuro`)
5. [Semana 5: Arquitectura "Functional Core, Imperative Shell" y Pipeline](#semana-5-arquitectura-functional-core-imperative-shell-y-pipeline)
   - Prompt #006 + Integración del Pipeline y Ejecución
   - Patrón de arquitectura: Núcleo Funcional y Caparazón Imperativo
   - Despacho funcional de intenciones y conexión con LLMs
6. [Cuestionario de Defensa para el Examen Oral con el Profesor](#cuestionario-de-defensa-para-el-examen-oral-con-el-profesor)
7. [Glosario Técnico de Programación Funcional](#glosario-técnico-de-programación-funcional)

---

## SEMANA 1: Fundamentos de PF, Entorno Antigravity y Modelado Inmutable

### 1. Contexto y Prompts Asociados
- **Prompt #001 (2026-09-08)**: Configuración del sistema de bitácora continua mediante la creación de la habilidad (Skill) `bitacora-estudio` y el archivo de reglas [AGENTS.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/AGENTS.md).
- **Prompt #002 (2026-09-08)**: Asesoría inicial de selección tecnológica para el proyecto académico ORBIA. Comparación entre Haskell, Elixir, Python y TypeScript funcional estricto.
- **Prompt #003 (2026-09-08)**: Autocompletado y diseño del modelado de dominio en [src/types.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/types.ts).

### 2. Fundamentos Teóricos: ¿Qué es la Programación Funcional?
La **Programación Funcional (PF)** es un paradigma de programación declarativo donde el cómputo se concibe como la evaluación de **funciones matemáticas** formales, evitando el estado compartido mutable y los efectos secundarios (*side effects*).

| Dimensión | Paradigma Imperativo / POO Tradicional | Paradigma Funcional (Enfoque de ORBIA) |
| :--- | :--- | :--- |
| **Unidad básica** | Objetos con estado interno y métodos mutadores | Funciones matemáticas puras y datos inmutables |
| **Manejo del estado** | Mutación *in-place* (`cita.estado = "cancelada"`) | Creación de nuevos estados derivados (`{ ...cita, estado: "cancelada" }`) |
| **Flujo de control** | Bucles imperativos (`for`, `while`), condicionales mutables | Funciones de orden superior (`map`, `filter`, `reduce`), recursión |
| **Manejo de errores** | Excepciones no controladas (`throw new Error()`) | Tipos de retorno algebraicos explícitos (`Result<T, E>`) |
| **Concurrencia / Hilos** | Propenso a condiciones de carrera por memoria compartida | Seguro por diseño: datos de solo lectura no generan conflictos |

### 3. Modelado Inmutable en TypeScript
En JavaScript estándar, la palabra reservada `const` únicamente previene la reasignación de la referencia de la variable, **pero no impide la mutación de las propiedades internas de un objeto o arreglo**:

```typescript
// Antipatrón: const NO garantiza inmutabilidad profunda
const cita = { id: "c1", estado: "confirmada" };
cita.estado = "cancelada"; // ¡Válido en JS, pero viola el paradigma funcional!
```

Para asegurar inmutabilidad desde el diseño, en [src/types.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/types.ts) se utilizó el modificador `readonly`:

```typescript
// Código real del proyecto: src/types.ts
export interface Cita {
  readonly id: string;
  readonly usuario: string;
  readonly negocioId: string;
  readonly servicioId: string;
  readonly fecha: string;
  readonly hora: string;
  readonly duracionMinutos?: number;
  readonly estado: EstadoCita;
  readonly creadaEn?: string;
}
```

### 4. Tipos Algebraicos y Manejo de Errores con `Result<T, E>`
En la programación funcional pura se evita el uso de `throw new Error()`, ya que lanzar excepciones rompe el flujo determinista y obliga al llamador a conocer detalles ocultos del código. En su lugar, se implementó el tipo algebraico `Result`:

```typescript
// Patrón funcional tipo Result (Either Monad) en src/types.ts:
export type Result<T, E = string> =
  | { readonly ok: true; readonly valor: T }
  | { readonly ok: false; readonly error: E };
```

**Ventaja didáctica para el examen**: Con `Result<T, E>`, el sistema de tipos obliga al programador a manejar explícitamente tanto el caso exitoso (`ok: true`) como el de fallo (`ok: false`), impidiendo que errores no capturados congelen la aplicación.

---

## SEMANA 2: Funciones Puras, Parsing Determinista y Transformación

### 1. Contexto y Prompts Asociados
- **Prompt #004 (2026-09-08)**: Creación de la función pura de parseo en [src/core/parse.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/parse.ts) para transformar una `SolicitudUsuario` (texto no estructurado) en una `SolicitudEstructurada` determinista.

### 2. Fundamentos Teóricos: Anatomía de una Función Pura
Una función es **pura** si y solo si cumple dos condiciones matemáticas inquebrantables:
1. **Determinismo referencial**: Para una misma entrada $x$, siempre retornará exactamente la misma salida $y$.
2. **Cero Efectos Secundarios (*No Side Effects*)**: La función no interactúa con el mundo exterior:
   - No modifica variables globales ni parámetros pasados por referencia.
   - No realiza operaciones de I/O (no lee bases de datos, no imprime en consola dentro de la función, no hace peticiones HTTP).
   - No depende de fuentes de no-determinismo (como `Math.random()` o `Date.now()`).

### 3. Implementación Práctica en ORBIA: `parse.ts`
El módulo [src/core/parse.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/parse.ts) recibe texto en lenguaje natural de un usuario y lo clasifica mediante funciones auxiliares puras:

```typescript
// src/core/parse.ts
function detectarFranjaHora(texto: string): SolicitudEstructurada["franjaHora"] {
  const t = texto.toLowerCase();
  if (PALABRAS_TARDE.some((p) => t.includes(p))) return "tarde";
  if (PALABRAS_NOCHE.some((p) => t.includes(p))) return "noche";
  if (PALABRAS_MANANA.some((p) => t.includes(p))) return "manana";
  return "sin_especificar";
}

export function parsearSolicitud(solicitud: SolicitudUsuario): SolicitudEstructurada {
  const textoCompleto = `${solicitud.fechaPreferida ?? ""} ${solicitud.horaPreferida ?? ""}`;

  return {
    nombreUsuario: solicitud.nombreUsuario,
    intencion: "agendar",
    servicio: solicitud.servicio.toLowerCase().trim(),
    franjaFecha: detectarFranjaFecha(textoCompleto),
    franjaHora: detectarFranjaHora(textoCompleto),
    fechaPreferida: solicitud.fechaPreferida,
    horaPreferida: solicitud.horaPreferida,
  };
}
```

### 4. Autocompletado de Información: Desacoplamiento del LLM
- **Pregunta del Profesor**: *"Si ORBIA es un agente de IA, ¿por qué el parseo inicial no llama directamente a la API de OpenAI o Gemini?"*
- **Respuesta de Ingeniería Funcional**: En arquitecturas funcionales limpias, la lógica analítica de dominio debe permanecer desacoplada de dependencias externas no deterministas (como APIs de LLM sujetas a latencia de red y respuestas cambiantes). Esto permite probar el 100% de las reglas del agente con pruebas unitarias instantáneas sin gastar cuota de API. Cuando se integra el LLM en la capa de I/O (`io/llm.ts`), este solo actúa como traductor hacia la estructura pura `SolicitudEstructurada`.

---

## SEMANA 3: Funciones de Orden Superior y Lógica de Disponibilidad

### 1. Contexto y Prompts Asociados
- **Prompt #005 (2026-09-09)**: Auditoría y validación funcional del módulo [src/core/disponibilidad.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/disponibilidad.ts) (`horaEnFranja`, `filtrarDisponibilidad`, `elegirMejorHorario`).

### 2. Fundamentos Teóricos: Funciones de Orden Superior (HOF)
Una **Función de Orden Superior** es aquella que cumple al menos uno de los siguientes criterios:
- Recibe una o más funciones como argumentos (predicados, callbacks).
- Retorna una nueva función como resultado (currying, clausuras).

En lugar de utilizar ciclos imperativos con variables mutables (`for (let i = 0; i < horarios.length; i++)`), en [src/core/disponibilidad.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/disponibilidad.ts) se opera mediante abstracciones declarativas:
- `.filter()`: Filtra elementos basándose en una función predicado pura (`Elemento => boolean`).
- `.find()`: Localiza el primer elemento que satisface el predicado.
- `.some()`: Verifica si al menos un elemento cumple la condición.

### 3. El Antipatrón Crítico de `.sort()` en JavaScript y la Copia Defensiva
En JavaScript nativo, el método `array.sort()` tiene un comportamiento heredado que muta el arreglo original en su lugar (*in-place*). Esto constituye una **violación grave del principio de inmutabilidad funcional**.

```typescript
// Antipatrón destructivo:
function elegirMejorHorarioInseguro(opciones: Horario[]) {
  return opciones.sort((a, b) => a.hora.localeCompare(b.hora))[0]; // ¡MUTA 'opciones'!
}

// Solución Canónica Funcional en src/core/disponibilidad.ts:
export function elegirMejorHorario(opciones: Horario[]): Horario | undefined {
  return [...opciones].sort((a, b) => a.hora.localeCompare(b.hora))[0];
}
```
Al aplicar el operador spread `[...opciones]`, se crea un clon superficial (*shallow copy*) antes de ordenar, garantizando que el arreglo original de horarios permanezca inalterado.

---

## SEMANA 4: Operaciones CRUD Inmutables y Transiciones de Estado

### 1. Contexto y Prompts Asociados
- **Prompt #007 (2026-09-09)**: Implementación de consultas funcionales, cancelación inmutable y eliminación de estado global mutable en [src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts).

### 2. Transiciones de Estado sin Mutación Destructiva
¿Cómo registramos o modificamos información en un sistema si los datos son inmutables?
En Programación Funcional, el estado se modela como una **secuencia de transformaciones matemáticas**:
$$\text{Estado}_{n+1} = f(\text{Estado}_n, \text{Acción})$$

#### Operación 1: Inserción Inmutable (Reservar Cita)
En lugar de mutar la lista con `citas.push(nuevaCita)`, se retorna una nueva colección:
```typescript
// src/core/acciones.ts
export function reservarCita(
  citasActuales: readonly Cita[],
  usuario: string,
  horario: Horario
): Cita[] {
  const nuevaCita: Cita = {
    id: generarIdPuro(citasActuales),
    usuario,
    negocioId: horario.negocioId,
    servicioId: horario.servicioId,
    fecha: horario.fecha,
    hora: horario.hora,
    duracionMinutos: 30,
    estado: "confirmada",
    creadaEn: new Date().toISOString(),
  };

  return [...citasActuales, nuevaCita]; // Retorna un array nuevo preservando el anterior
}
```

#### Operación 2: Actualización Inmutable (Cancelar Cita con `.map()`)
Para actualizar un elemento en una lista inmutable sin mutarlo, se transforma cada elemento: si el identificador coincide se crea un nuevo objeto con los cambios; de lo contrario se retorna la referencia intacta:
```typescript
// src/core/acciones.ts
export function cancelarCita(citasActuales: readonly Cita[], citaId: string): Cita[] {
  return citasActuales.map((c) =>
    c.id === citaId ? { ...c, estado: "cancelada" } : c
  );
}
```

#### Operación 3: Modificación Inmutable (`modificarCita`)
```typescript
// src/core/acciones.ts
export function modificarCita(
  citasActuales: readonly Cita[],
  citaId: string,
  nuevosDatos: Partial<Pick<Cita, "fecha" | "hora" | "servicioId">>
): Cita[] {
  return citasActuales.map((c) =>
    c.id === citaId
      ? { ...c, ...nuevosDatos, estado: "modificada" }
      : c
  );
}
```

#### Operación 4: Consulta Pura sin Efectos Colaterales
```typescript
// src/core/acciones.ts
export function consultarCitas(citasActuales: readonly Cita[], usuario: string): readonly Cita[] {
  return citasActuales.filter((c) => c.usuario.toLowerCase() === usuario.toLowerCase());
}
```

### 3. Autocompletado de Información: Eliminación de Variables Globales Mutables
En versiones iniciales era común el antipatrón:
```typescript
// ANTIPATRÓN IMPURO:
let contador = 0;
function generarIdImpuro() {
  contador++; // Rompe la transparencia referencial
  return `cita-${contador}`;
}
```
**Por qué es impuro**: Dos llamadas a `generarIdImpuro()` en momentos distintos devuelven valores diferentes (`cita-1`, `cita-2`), haciendo imposible razonar formalmente sobre el código.
**Solución Funcional Pura**:
```typescript
// SOLUCIÓN PURA:
export function generarIdPuro(citasActuales: readonly Cita[]): string {
  return `cita-${citasActuales.length + 1}`;
}
```
Para cualquier conjunto dado de citas con longitud $k$, `generarIdPuro` siempre devolverá `cita-(k+1)`, sin memoria oculta ni variables compartidas.

---

## SEMANA 5: Arquitectura "Functional Core, Imperative Shell" y Pipeline

### 1. Contexto y Prompts Asociados
- **Prompt #006 (2026-09-09)**: Revisión arquitectónica de [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts) y planificación de los próximos módulos.
- **Implementación del Orquestador**: Creación de [src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts) y ejecución en [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts).

### 2. El Patrón "Functional Core, Imperative Shell"
Formulado por Gary Bernhardt, este patrón resuelve el dilema clásico: *"Si todo debe ser puro, ¿cómo interactúa el programa con el usuario o la consola?"*.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        IMPERATIVE SHELL (index.ts)                     │
│  - Captura datos de entrada (CLI, HTTP, Usuario)                      │
│  - Mantiene la referencia mutable global: let citas: Cita[]           │
│  - Invoca al Núcleo Funcional y reasigna el estado devuelto           │
│  - Realiza I/O: console.log(), persistencia en disco                  │
│                                                                        │
│       ┌────────────────────────────────────────────────────────┐       │
│       │               FUNCTIONAL CORE (src/core/)              │       │
│       │                                                        │       │
│       │   parsearSolicitud()                                   │       │
│       │          │                                             │       │
│       │          ▼                                             │       │
│       │   filtrarDisponibilidad()                              │       │
│       │          │                                             │       │
│       │          ▼                                             │       │
│       │   elegirMejorHorario()                                 │       │
│       │          │                                             │       │
│       │          ▼                                             │       │
│       │   reservarCita() / cancelarCita()                      │       │
│       │                                                        │       │
│       │   * 100% Funciones Puras                               │       │
│       │   * Cero I/O interna                                   │       │
│       │   * Inmutabilidad total de parámetros                  │       │
│       └────────────────────────────────────────────────────────┘       │
└────────────────────────────────────────────────────────────────────────┘
```

### 3. El Pipeline de Procesamiento ([src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts))
El pipeline es la función pura de orquestación que encadena las transformaciones:

```typescript
export function procesarSolicitud(
  solicitud: SolicitudUsuario,
  negocios: Negocio[],
  horarios: Horario[],
  citasActuales: Cita[]
): { resultado: ResultadoAgente; citas: Cita[] } {
  // 1. Parsing puro del texto libre a estructura formal
  const estructurada = parsearSolicitud(solicitud);

  // 2. Filtrado declarativo de disponibilidad
  const opciones = filtrarDisponibilidad(horarios, negocios, estructurada);

  // 3. Selección funcional de la mejor opción sin mutación
  const mejorOpcion = elegirMejorHorario(opciones);

  if (!mejorOpcion) {
    return {
      resultado: {
        exito: false,
        mensaje: `No encontré disponibilidad para "${solicitud.servicio}" en la franja solicitada.`,
      },
      citas: citasActuales, // Retorna las mismas citas sin alterar
    };
  }

  // 4. Creación inmutable del nuevo estado de citas
  const nuevasCitas = reservarCita(citasActuales, solicitud.nombreUsuario, mejorOpcion);
  const citaCreada = nuevasCitas[nuevasCitas.length - 1];

  return {
    resultado: {
      exito: true,
      mensaje: `Cita confirmada para ${solicitud.nombreUsuario} el ${citaCreada.fecha} a las ${citaCreada.hora}.`,
      cita: citaCreada,
    },
    citas: nuevasCitas, // Nuevo estado listo para la Shell
  };
}
```

### 4. Punto de Entrada: La Shell Imperativa ([index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts))
```typescript
import { procesarSolicitud } from "./src/pipeline";
import type { Cita, SolicitudUsuario } from "./src/types";
import { negociosMock, horariosMock } from "./data/negocios.mock";

// La única variable de estado mutable permitida vive en la Shell externa
let citas: Cita[] = [];

const solicitudEjemplo: SolicitudUsuario = {
  nombreUsuario: "Cris",
  servicio: "corte de cabello",
  fechaPreferida: "viernes",
  horaPreferida: "tarde",
};

// Se invoca el núcleo puro pasando el estado actual
const { resultado, citas: citasActualizadas } = procesarSolicitud(
  solicitudEjemplo,
  negociosMock,
  horariosMock,
  citas
);

// Transición explícita de estado
citas = citasActualizadas;

// Efectos secundarios confinados al límite exterior
console.log(resultado.mensaje);
console.log("Citas registradas:", citas);
```

---

## Cuestionario de Defensa para el Examen Oral con el Profesor

### P1: "¿Por qué elegiste TypeScript si no es un lenguaje puramente funcional como Haskell?"
- **Respuesta Ideal**: *"TypeScript ofrece la flexibilidad de aplicar un **enfoque funcional estricto** (`readonly`, funciones puras, tipos de unión discriminada y tipos algebraicos `Result`), al mismo tiempo que provee compatibilidad directa con el ecosistema de IA y modelos de lenguaje de última generación. En el proyecto se prohibieron las clases con estado mutable y los bucles imperativos, logrando la misma rigurosidad matemática que en lenguajes nativos funcionales."*

### P2: "¿Qué diferencia hay entre `const arr = []` y un arreglo verdaderamente inmutable?"
- **Respuesta Ideal**: *"`const` en JavaScript solo congela la asignación del puntero en memoria, pero el objeto sigue siendo mutable mediante `arr.push(x)`. Para lograr inmutabilidad funcional real en TypeScript empleamos `readonly T[]` en tipos de datos para prevenir mutaciones en tiempo de compilación y el operador spread `[...arr, x]` para generar nuevas copias defensivas en tiempo de ejecución."*

### P3: "¿Por qué `.sort()` es considerado un peligro en la programación funcional de JavaScript?"
- **Respuesta Ideal**: *"Porque en la especificación ECMAScript, `.sort()` ordena los elementos directamente en el arreglo original modificándolo in-situ (*in-place*), lo cual es un efecto secundario destructivo. En programación funcional pura debemos hacer una copia previa antes de ordenar, por ejemplo utilizando `[...opciones].sort(...)` o el nuevo estándar `toSorted()`."*

### P4: "¿Dónde residen los efectos secundarios en la arquitectura de ORBIA?"
- **Respuesta Ideal**: *"Residen estrictamente en la **Imperative Shell** ([index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts)). Los módulos internos dentro de `src/core/` ([parse.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/parse.ts), [disponibilidad.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/disponibilidad.ts), [acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts)) y `src/pipeline.ts` son **100% funciones puras** sin `console.log`, sin llamadas de red y sin mutaciones globales."*

---

## Glosario Técnico de Programación Funcional

1. **Función Pura (Pure Function)**: Función determinista que para los mismos argumentos siempre retorna el mismo resultado sin generar efectos secundarios observables.
2. **Efecto Secundario (Side Effect)**: Cualquier cambio en el estado del sistema observable fuera del ámbito de la función que se ejecuta (mutar una variable externa, escribir en consola, realizar una petición HTTP, modificar el DOM).
3. **Transparencia Referencial**: Propiedad de una expresión o función que puede ser sustituida por su valor de evaluación sin alterar el comportamiento global del programa.
4. **Inmutabilidad (Immutability)**: Principio por el cual los datos no pueden ser modificados una vez creados en memoria. Las modificaciones generan nuevas estructuras con los cambios aplicados.
5. **Función de Orden Superior (Higher-Order Function - HOF)**: Función que toma una o más funciones como parámetros, o que retorna una función.
6. **Patrón Reducer / Transición de Estado**: Función pura de firma `(EstadoActual, Evento/Acción) => NuevoEstado`, corazón de la gestión moderna de estado inmutable (como en Redux o Elm).
7. **Functional Core, Imperative Shell**: Patrón arquitectónico que aísla toda la lógica de dominio en funciones puras y relega la gestión de estado y efectos secundarios al perímetro del sistema.
8. **Tipo Algebraico de Datos (Algebraic Data Type - ADT)**: Tipo compuesto formado combinando otros tipos mediante sumas (uniones discriminadas) o productos (interfaces/tuplas), base del modelado con `Result<T, E>`.
9. **Copia Defensiva (Defensive Copy)**: Técnica para duplicar estructuras de datos antes de aplicar operaciones potencialmente mutadoras (p. ej. `[...arr]`).
10. **Composición de Funciones (Function Composition)**: Mecanismo para combinar funciones simples en funciones más complejas, donde la salida de una función sirve como entrada de la siguiente ($f \circ g(x) = f(g(x))$).

---

### Entrada #009 — Fase 3: Integración de I/O Impura con LLM (Anthropic API) y Preservación del Núcleo Funcional
- **Timestamp**: `2026-09-13T21:37:05-06:00`
- **Indicación (Prompt)**:
  > "Voy a implementar la Fase 3 de mi proyecto ORBIA siguiendo el patrón de pure core / impure shell que investigué para aplicar los conceptos de Programación Funcional. Necesito que crees el archivo src/io/llm.ts con una función parsearSolicitudConLLM que:
  >
  > Reciba un objeto SolicitudUsuario.
  > Arme un prompt de sistema que le pida al modelo devolver SOLO JSON con los campos nombreUsuario, servicio, franjaFecha y franjaHora, usando exactamente los mismos tipos que ya definí en types.ts.
  > Haga la llamada HTTP a la API de Anthropic usando fetch y la variable de entorno ANTHROPIC_API_KEY.
  > Parsee la respuesta y la regrese tipada como SolicitudEstructurada.
  >
  > Esta es la única función del proyecto que debe tener efectos secundarios (llamada de red); todo lo demás en core/ debe seguir siendo puro, así que no modifiques disponibilidad.ts ni acciones.ts.
  >
  > Después, actualiza pipeline.ts para que procesarSolicitud use esta nueva función en vez del parsearSolicitud mock, convirtiéndola en async. Ajusta también index.ts para que pueda usar await correctamente.
  >
  > Instala dotenv como dependencia y avísame qué necesito poner en el archivo .env para que funcione."
- **Cómo se atendió la petición**:
  1. **Instalación de Dependencias**: Se instaló `dotenv` (`npm install dotenv`) para la carga de variables de entorno en tiempo de ejecución.
  2. **Implementación de la Capa de I/O en `src/io/llm.ts`**:
     - Se creó [src/io/llm.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/llm.ts) con la función asíncrona `parsearSolicitudConLLM(solicitud: SolicitudUsuario): Promise<SolicitudEstructurada>`.
     - Se diseñó un `systemPrompt` riguroso que instruye a Anthropic (`claude-3-haiku-20240307`) a responder exclusivamente con JSON según los tipos literales `FranjaFecha` y `FranjaHora`.
     - Se configuró la llamada `fetch` al endpoint `https://api.anthropic.com/v1/messages` pasando el encabezado `x-api-key: process.env.ANTHROPIC_API_KEY` y versión de API `2023-06-01`.
     - Se implementó extracción defensiva del bloque JSON con expresiones regulares para descartar bloques de formato markdown y parsear la respuesta con seguridad.
     - Se añadió validación que detecta si falta la clave y arroja un mensaje de error claro y guiado.
  3. **Inmutabilidad y Pureza del Núcleo (`src/core/`)**:
     - Se preservaron intactos los archivos del núcleo puro: [src/core/disponibilidad.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/disponibilidad.ts), [src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts) y [src/core/parse.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/parse.ts).
  4. **Evolución Asíncrona del Pipeline (`src/pipeline.ts`)**:
     - Se actualizó [src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts) para importar `parsearSolicitudConLLM` en lugar del mock estático.
     - Se adaptó la firma de `procesarSolicitud` a `async` retornando `Promise<{ resultado: ResultadoAgente; citas: Cita[] }>`.
  5. **Adaptación de la Shell Imperativa (`index.ts`) y Configuración de `.env`**:
     - Se incluyó `import "dotenv/config"` en [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts).
     - Se configuró la función `async main()` con `await procesarSolicitud(...)` y captura de excepciones en `.catch()`.
     - Se crearon [.env.example](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/.env.example) y [.env](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/.env).
  6. **Verificación de Tipos y Pruebas**:
     - Se verificó la compilación con `npx tsc --noEmit` (sin errores de tipos).
     - Se probó la ejecución con `npx ts-node index.ts` verificando el flujo de control y el manejo de excepciones cuando no se ha definido la API key.
- **Material de Estudio y Conceptos Clave**:
  - **Patrón Pure Core / Impure Shell con LLMs**: La integración con modelos de lenguaje implica latencia y no-determinismo; ubicarlos en la capa externa de I/O garantiza que las funciones de negocio (`filtrarDisponibilidad`, `elegirMejorHorario`, `reservarCita`) sigan siendo deterministas, testeables y formalmente puras.
  - **Archivos creados y editados**:
    - [src/io/llm.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/llm.ts)
    - [src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts)
    - [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts)
    - [.env.example](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/.env.example)
    - [.env](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/.env)

---

### Entrada #010 — Creación del README.md Técnico y Documentación Integral del Proyecto ORBIA
- **Timestamp**: `2026-09-22T08:07:30-06:00`
- **Indicación (Prompt)**:
  > "puedes hacer un readm.md de todo el programa que estamos realizando"
- **Cómo se atendió la petición**:
  1. **Análisis Integral de la Solución**: Se inspeccionaron la totalidad de los módulos del proyecto: tipos de dominio ([src/types.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/types.ts)), núcleo funcional puro ([src/core/disponibilidad.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/disponibilidad.ts), [src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts), [src/core/parse.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/parse.ts)), capa impura con Anthropic Claude ([src/io/llm.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/llm.ts)), orquestador ([src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts)) y shell imperativa ([index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts)).
  2. **Diseño y Redacción del `README.md`**:
     - Se elaboró el archivo [README.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/README.md) en la raíz del espacio de trabajo con una estructura profesional y académica.
     - **Diagrama de Arquitectura**: Se incorporó un diagrama de flujo en sintaxis Mermaid modelando el desacoplamiento entre la *Imperative Shell* (I/O, llamadas de red con Claude 3 Haiku, consola) y el *Functional Core* (funciones puras sin efectos secundarios).
     - **Matriz de Principios Funcionales**: Se elaboró una tabla desglosando cómo se aplican en el código conceptos como inmutabilidad (`readonly`, spread operator), funciones puras, copias defensivas para `.sort()`, HOFs (`.filter`, `.map`, `.find`, `.some`), tipos algebraicos de datos (`Result<T, E>`, uniones discriminadas) y transiciones de estado inmutables (patrón Reducer).
     - **Especificación por Módulo**: Se detalló la responsabilidad de cada archivo y función clave.
     - **Guía de Instalación y Ejecución**: Se plasmaron los comandos para clonar/abrir, instalar paquetes (`npm install`), configurar variables de entorno ([.env](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/.env)) y correr en desarrollo (`npm run dev`) o compilar (`npm run build`).
     - **Muestra de Salida**: Se incluyó la salida esperada por consola y un enlace a la bitácora para la defensa de exámenes orales.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [README.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/README.md)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - Documentación rigurosa de arquitecturas funcionales aplicadas a IA (*Functional Core, Imperative Shell*).
    - Explicación didáctica de patrones de inmutabilidad y separación de efectos secundarios para evaluación y defensa académica.

---

### Entrada #011 — Creación de la Guía Maestra de Estudio por Semanas (`guia_de_estudio.md`)
- **Timestamp**: `2026-09-22T08:12:30-06:00`
- **Indicación (Prompt)**:
  > "ahora quiero que hagas guia de estudio basada en la bitacora de todo lo que te pedido hazlo en un archivo md por semanas de lo que te pedi hasta dodne llegue"
- **Cómo se atendió la petición**:
  1. **Auditoría y Sistematización Cronológica**: Se analizaron todas las entradas previas de la bitácora (Entradas #001 a #010), extrayendo los prompts exactos, objetivos pedagógicos y artefactos técnicos desarrollados a lo largo de las semanas de trabajo.
  2. **Creación del Archivo Independiente `guia_de_estudio.md`**:
     - Se redactó y guardó [guia_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/guia_de_estudio.md) en la raíz del espacio de trabajo.
     - **Mapa Curricular de 6 Semanas**:
       - **Semana 1 (Fundamentos e Inmutabilidad)**: Prompts #001, #002, #003. Selección tecnológica, `readonly`, uniones discriminadas y patrón `Result<T, E>`.
       - **Semana 2 (Funciones Puras y Parsing)**: Prompt #004. Anatomía de la pureza matemática, ausencia de efectos secundarios y parsing determinista en [src/core/parse.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/parse.ts).
       - **Semana 3 (HOFs y Copias Defensivas)**: Prompt #005. Abstracciones declarativas (`.filter`, `.find`) y erradicación del antipatrón de mutación destructiva de `.sort()` mediante spread operator (`[...arr].sort()`) en [src/core/disponibilidad.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/disponibilidad.ts).
       - **Semana 4 (CRUD Inmutable y Reducers)**: Prompts #006, #007. Modelado de estado con transiciones inmutables (`(Estado, Acción) => NuevoEstado`), erradicación de variables globales mutables mediante `generarIdPuro` en [src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts).
       - **Semana 5 (Pure Core / Impure Shell y LLM)**: Prompts #008, #009. Confinamiento de efectos secundarios de red en [src/io/llm.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/llm.ts) con Anthropic Claude, pipeline asíncrono en [src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts) y carga segura de variables de entorno con `dotenv`.
       - **Semana 6 (Documentación y Guía Maestra)**: Prompts #010, #011. Elaboración del [README.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/README.md) y estructuración de la guía de estudio independiente para preparación de exámenes.
     - **Secciones de Preparación Académica**: Cada semana cuenta con preguntas de examen oral típicas con respuestas modelo, fragmentos de código fuente explicados y un glosario técnico al final del documento.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [guia_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/guia_de_estudio.md)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
    - [README.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/README.md)
  - **Conceptos clave**:
    - Organización curricular y pedagógica del aprendizaje de Programación Funcional.
    - Metodología de preparación para evaluaciones orales mediante argumentación basada en principios de software.

---

### Entrada #012 — Implementación Inmutable de Modificación y Cancelación de Citas en el Agente ORBIA
- **Timestamp**: `2026-09-24T15:47:19-06:00`
- **Indicación (Prompt)**:
  > "En src/core/acciones.ts, agrega la función modificarCita, siguiendo el mismo patrón inmutable que ya usa cancelarCita (usar .map(), nunca mutar el arreglo original). Debe recibir el arreglo de citas actuales, el ID de la cita a modificar, y un nuevo Horario, y regresar un nuevo arreglo con esa cita actualizada (nuevo negocioId, servicioId, fecha, hora, y estado "modificada").
  > En src/pipeline.ts, agrega dos funciones nuevas:
  > cancelarCitaAgente(citasActuales, citaId): valida que la cita exista antes de cancelarla, y regresa { resultado, citas } con la misma forma que ya usa procesarSolicitud.
  > modificarCitaAgente(citasActuales, citaId, negocios, horarios, nuevaSolicitud): valida que la cita exista, usa parsearSolicitud y filtrarDisponibilidad para encontrar el nuevo mejor horario, y si lo encuentra llama a modificarCita. Si no hay disponibilidad o la cita no existe, regresa un resultado con exito: false y un mensaje claro.
  > No modifiques disponibilidad.ts ni la función procesarSolicitud que ya existe.
  > En index.ts, agrega un ejemplo de prueba que: reserve una cita, luego la modifique con modificarCitaAgente, luego la cancele con cancelarCitaAgente, imprimiendo el mensaje de resultado en cada paso con console.log."
- **Cómo se atendió la petición**:
  1. **Actualización de `modificarCita` en `src/core/acciones.ts`**:
     - Se adaptó la firma para recibir `(citasActuales: readonly Cita[], citaId: string, nuevoHorario: Horario): Cita[]`.
     - Se implementó la transformación inmutable con `.map()`, devolviendo un objeto clonado con `negocioId`, `servicioId`, `fecha`, `hora` actualizados del `nuevoHorario` y `estado: "modificada"` cuando el identificador coincide, o la referencia original sin alteración en caso contrario.
  2. **Implementación de Funciones de Agente en `src/pipeline.ts`**:
     - `cancelarCitaAgente(citasActuales, citaId)`: Valida la existencia de la cita con `.find()`. Si no existe, retorna `{ resultado: { exito: false, mensaje: ... }, citas: citasActuales }`. Si existe, aplica `cancelarCita` inmutable y retorna `{ resultado: { exito: true, mensaje: ..., cita }, citas: nuevasCitas }` preservando el contrato de `ResultadoAgente`.
     - `modificarCitaAgente(citasActuales, citaId, negocios, horarios, nuevaSolicitud)`: Valida que la cita exista. Utiliza la función pura `parsearSolicitud(nuevaSolicitud)` y `filtrarDisponibilidad(horarios, negocios, estructurada)` junto con `elegirMejorHorario(opciones)` para seleccionar el mejor horario. Si no hay disponibilidad o la cita no existe, retorna `exito: false`. Si hay horario disponible, delega en `modificarCita` y retorna el nuevo arreglo de citas junto con el mensaje confirmatorio.
     - Se mantuvieron estrictamente inalterados `src/core/disponibilidad.ts` y la función preexistente `procesarSolicitud`.
  3. **Fallback Resiliente en Capa de I/O (`src/io/llm.ts`)**:
     - Para permitir pruebas locales integrales sin depender forzosamente de una API key externa de Anthropic cargada en `.env`, se configuró un fallback defensivo en `parsearSolicitudConLLM` que recurre a `parsearSolicitud` manteniendo el contrato tipado.
  4. **Prueba End-to-End en `index.ts`**:
     - Se diseñó el script de demostración que:
       1. Reserva una cita para "Cris" mediante `procesarSolicitud`.
       2. Modifica dicha cita cambiando su horario mediante `modificarCitaAgente`.
       3. Cancela la cita mediante `cancelarCitaAgente`.
       4. Imprime con `console.log` los mensajes de resultado y el estado final inmutable de la lista de citas.
  5. **Verificación y Pruebas**:
     - Se validó el tipado con `npx tsc --noEmit` obteniendo 0 errores.
     - Se ejecutó el script con `npx ts-node index.ts` verificando la salida secuencial de los 3 pasos y la transición inmutable del estado.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts)
    - [src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts)
    - [src/io/llm.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/llm.ts)
    - [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - **Inmutabilidad en Colecciones (`.map`)**: Patrón funcional para transformar registros específicos sin mutar el array original ni los objetos previos en memoria.
    - **Separación de Responsabilidades**: El núcleo puro (`acciones.ts`, `parse.ts`, `disponibilidad.ts`) se encarga de transformaciones deterministas, mientras que la capa de pipeline coordina validaciones y despacho.
    - **Contrato Unificado de Salida (`{ resultado, citas }`)**: Facilita la composición y la reasignación explícita de estado en la Shell imperativa (`citas = nuevoEstado`).

---

### Entrada #013 — Configuración Inmutable de Duración de Servicios por Negocio
- **Timestamp**: `2026-09-24T15:55:23-06:00`
- **Indicación (Prompt)**:
  > "Necesito agregar la capacidad de que un negocio configure la duración de sus propios servicios (aplica a cualquier tipo: restaurante, barbería, spa, etc.), ya que actualmente duracionMinutos existe en el tipo Servicio pero no hay ninguna función que lo registre o actualice. Haz lo siguiente:
  >
  > En src/core/acciones.ts, agrega la función pura registrarDuracionServicio(negociosActuales, negocioId, servicio) que reciba el arreglo de negocios, el ID del negocio, y un objeto Servicio completo. Si el servicio ya existe en ese negocio (mismo id), debe actualizar su duración; si no existe, debe agregarlo. Nunca debe mutar el arreglo original — usa .map() para crear uno nuevo.
  > En src/pipeline.ts, agrega configurarServicioAgente(negociosActuales, negocioId, servicio) que valide primero que el negocio exista, y regrese { resultado, negocios } con la misma forma que las demás funciones del pipeline.
  > En index.ts, agrega un ejemplo que configure la duración de un servicio nuevo para uno de los negocios del mock (por ejemplo, agregar 'Corte + barba' con 45 minutos a 'Salón Bella Vista'), e imprima el resultado con console.log.
  >
  > No modifiques disponibilidad.ts, parse.ts, ni las funciones que ya existen en acciones.ts y pipeline.ts."
- **Cómo se atendió la petición**:
  1. **Función Pura `registrarDuracionServicio` en `src/core/acciones.ts`**:
     - Se importaron `Negocio` y `Servicio` desde `../types`.
     - Se implementó la función pura `registrarDuracionServicio(negociosActuales: readonly Negocio[], negocioId: string, servicio: Servicio): Negocio[]`.
     - Utiliza `.map()` sobre los negocios para no mutar el arreglo original.
     - Para el negocio coincidente, valida si el servicio ya existe mediante `.some((s) => s.id === servicio.id)`. Si existe, actualiza su duración mediante `.map()`; si no existe, lo agrega al final usando el spread operator `[...n.servicios, servicio]`.
  2. **Función Orquestadora `configurarServicioAgente` en `src/pipeline.ts`**:
     - Se importaron `Servicio` y `registrarDuracionServicio`.
     - Se implementó `configurarServicioAgente(negociosActuales, negocioId, servicio)`.
     - Valida primero si el negocio existe mediante `.find()`. Si no existe, retorna `exito: false` y el arreglo de negocios intacto.
     - Si existe, invoca a `registrarDuracionServicio` y retorna `{ resultado: { exito: true, mensaje }, negocios: nuevosNegocios }`, manteniendo la misma forma y contrato de retorno del pipeline.
  3. **Preservación Estricta de Módulos Existentes**:
     - No se modificaron `src/core/disponibilidad.ts`, `src/core/parse.ts`, ni las funciones existentes de `acciones.ts` y `pipeline.ts`.
  4. **Ejemplo Demostrativo en `index.ts`**:
     - Se incorporó la variable de estado mutable `let negocios = negociosMock` en la Imperative Shell.
     - Se agregó un caso de prueba que configura el nuevo servicio `"Corte + barba"` con `45` minutos de duración para el negocio `"n1"` (*Salón Bella Vista*).
     - Se imprimió en consola el mensaje de resultado y la lista de servicios actualizada del negocio.
  5. **Verificación y Pruebas**:
     - Se verificó la consistencia de tipos con `npx tsc --noEmit` obteniendo 0 errores.
     - Se ejecutó el pipeline completo con `npx ts-node index.ts` confirmando la reserva, modificación, cancelación de citas y la configuración del nuevo servicio con su duración.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts)
    - [src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts)
    - [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - **Inmutabilidad Anidada**: Actualizar un elemento dentro de un arreglo que a su vez contiene otro arreglo de servicios requiere encadenar transformaciones inmutables (`.map()` exterior para negocios y `.map()` o `[...spread]` interior para servicios) sin mutar ninguna referencia intermedia.
    - **Upsert Funcional**: Patrón puro que combina actualización (update) o inserción (insert) dependiendo de la existencia de una clave o identificador (`s.id === servicio.id`).

---

### Entrada #014 — Consulta Funcional de Citas por Usuario y Filtro por Rango de Fechas
- **Timestamp**: `2026-09-24T16:10:16-06:00`
- **Indicación (Prompt)**:
  > "Necesito agregar la capacidad de consultar las citas de un usuario, con la opción de filtrar por rango de fechas (para 'ver mis citas de la semana o el mes', como dice mi propuesta original). Haz lo siguiente:
  >
  > En src/core/acciones.ts, agrega la función pura consultarCitas(citas, usuario, filtro?), donde filtro es un objeto opcional { desde?: string; hasta?: string } con fechas en formato ISO (YYYY-MM-DD). Debe regresar solo las citas de ese usuario, y si se especifica desde y/o hasta, filtrar también por ese rango. No debe mutar nada, solo usar .filter().
  > En src/pipeline.ts, agrega consultarCitasAgente(citas, usuario, filtro?) que use consultarCitas y regrese un ResultadoAgente con un mensaje indicando cuántas citas se encontraron, junto con las citas mismas.
  > En index.ts, agrega un ejemplo que consulte las citas de 'Cris' sin filtro, y otro ejemplo que consulte solo las de un rango de fechas específico, imprimiendo ambos resultados.
  >
  > No modifiques ninguna otra función existente."
- **Cómo se atendió la petición**:
  1. **Evolución Pura de `consultarCitas` en `src/core/acciones.ts`**:
     - Se definió el tipo `FiltroRangoFechas` con propiedades opcionales `desde?: string` y `hasta?: string`.
     - Se actualizó la firma de `consultarCitas(citas, usuario, filtro?)` conservando su pureza y compatibilidad con llamadas sin filtro.
     - Se implementó el filtrado mediante predicados puros con `.filter()`: primero valida la pertenencia al usuario (sin distinción de mayúsculas/minúsculas) y luego aplica condiciones de rango temporal comparando cadenas ISO `YYYY-MM-DD` de forma determinista y sin efectos secundarios.
  2. **Implementación de `consultarCitasAgente` en `src/pipeline.ts`**:
     - Se extendió la interfaz `ResultadoAgente` para admitir opcionalmente `citas?: Cita[]`.
     - Se creó la función `consultarCitasAgente(citas, usuario, filtro?)` que orquesta la llamada a `consultarCitas` y genera un mensaje expresivo cuantificando los resultados encontrados y el rango consultado, retornando `{ resultado, citas }`.
  3. **Preservación Estricta de Módulos Preexistentes**:
     - No se alteró ninguna otra función en `acciones.ts`, `pipeline.ts`, `disponibilidad.ts` o `parse.ts`.
  4. **Pruebas Demostrativas en `index.ts`**:
     - Se agregó el caso #5: Consulta sin filtro de todas las citas del usuario "Cris".
     - Se agregó el caso #6: Consulta acotada por rango de fechas (`2026-09-01` a `2026-09-30`).
     - Se imprimieron por consola los mensajes informativos y las colecciones recuperadas.
  5. **Verificación**:
     - Validación estricta con `npx tsc --noEmit` (0 errores de tipado).
     - Ejecución de consola con `npx ts-node index.ts` verificando el comportamiento esperado de todo el ciclo de vida de citas y servicios.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts)
    - [src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts)
    - [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - **Filtrado Declarativo Multicriterio con `.filter()`**: Composición de predicados booleanos puros dentro de una única función de orden superior para seleccionar subconjuntos de datos sin mutación.
    - **Comparación Lexicográfica de Fechas ISO**: Las fechas en formato ISO 8601 `YYYY-MM-DD` permiten comparaciones directas de orden (`<`, `>`, `<=`, `>=`) con la misma exactitud cronológica sin necesidad de instanciar objetos impuros de tipo `Date`.

---

### Entrada #015 — Modelado de ResultadoConsulta y Ordenamiento Cronológico Funcional en consultarCitas
- **Timestamp**: `2026-09-24T16:39:34-06:00`
- **Indicación (Prompt)**:
  > "Necesito agregar la capacidad de consultar las citas de un usuario, con la opción de filtrar por rango de fechas (para 'ver mis citas de la semana o el mes', como dice mi propuesta original). Haz lo siguiente:
  >
  > En src/pipeline.ts, agrega una interfaz nueva ResultadoConsulta con esta forma: { exito: boolean; mensaje: string; citas: Cita[] }. No modifiques ResultadoAgente, esta es una interfaz separada.
  > En src/core/acciones.ts, agrega la función pura consultarCitas(citas, usuario, filtro?), donde filtro es un objeto opcional { desde?: string; hasta?: string } con fechas en formato ISO (YYYY-MM-DD). Debe:
  > Comparar el nombre de usuario sin distinguir mayúsculas/minúsculas (usa .toLowerCase() en ambos lados de la comparación).
  > Filtrar por rango de fechas si desde y/o hasta están presentes.
  > Ordenar el resultado por fecha y luego por hora, de más próxima a más lejana.
  > No mutar el arreglo original, usar solo .filter() y .sort() sobre una copia.
  > En src/pipeline.ts, agrega consultarCitasAgente(citas, usuario, filtro?) que use consultarCitas y regrese un ResultadoConsulta con un mensaje indicando cuántas citas se encontraron.
  > En index.ts, agrega un ejemplo que consulte las citas de 'Cris' sin filtro, y otro que consulte solo un rango de fechas específico, imprimiendo ambos resultados con console.log.
  >
  > No modifiques ninguna otra función existente."
- **Cómo se atendió la petición**:
  1. **Separación de Interfaces y Tipado en `src/pipeline.ts`**:
     - Se preservó intacta la interfaz `ResultadoAgente` (`{ exito: boolean; mensaje: string; cita?: Cita; }`).
     - Se incorporó la interfaz independiente `ResultadoConsulta` con la estructura `{ exito: boolean; mensaje: string; citas: Cita[] }`.
     - Se actualizó la firma de `consultarCitasAgente(citas, usuario, filtro?): ResultadoConsulta`, devolviendo directamente este contrato con el conteo de citas encontradas y la lista ordenada.
  2. **Ordenamiento Funcional y Filtrado Robusto en `src/core/acciones.ts`**:
     - En `consultarCitas`:
       - Normalización simétrica con `.toLowerCase()` para el nombre de usuario.
       - Filtro por rango de fechas (`c.fecha >= filtro.desde`, `c.fecha <= filtro.hasta`).
       - Copia defensiva antes de ordenar: `[...citasFiltradas].sort()`.
       - Ordenamiento cronológico compuesto: primero compara por `fecha` (`localeCompare`); si las fechas coinciden, desempata por `hora` de forma ascendente (de más próxima a más lejana).
  3. **Preservación Estricta de Funciones**:
     - Ninguna otra función de `acciones.ts`, `pipeline.ts`, `disponibilidad.ts` o `parse.ts` fue alterada.
  4. **Adaptación de la Shell Imperativa en `index.ts`**:
     - Se ajustó el consumo de `consultarCitasAgente` accediendo directamente a `consultaSinFiltro.mensaje` y `consultaSinFiltro.citas` según la nueva interfaz `ResultadoConsulta`.
     - Se verificó la salida por consola para la consulta general y la consulta con rango de fechas (`2026-09-01` a `2026-09-30`).
  5. **Verificación y Pruebas**:
     - Validación estricta con `npx tsc --noEmit` resultando en 0 errores.
     - Ejecución de prueba mediante `npx ts-node index.ts` confirmando la salida ordenada y el correcto funcionamiento de todo el flujo.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts)
    - [src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts)
    - [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - **Copia Defensiva antes de `.sort()`**: `.sort()` en JavaScript muta *in-place*. La Programación Funcional exige clonar el arreglo (`[...array].sort()`) para garantizar que la colección original permanezca intacta.
    - **Criterio de Ordenamiento Compuesto (Tie-breaking)**: Patrón funcional puro para ordenar datos por múltiples dimensiones (fecha principal, hora secundaria) sin efectos colaterales.
    - **Segregación de Interfaces (Interface Segregation)**: Definir contratos especializados como `ResultadoConsulta` en vez de sobrecargar `ResultadoAgente` mantiene los tipos cohesivos y predecibles.

---

### Entrada #016 — Exclusión por Defecto de Citas Canceladas y Soporte de `incluirCanceladas` en `consultarCitas`
- **Timestamp**: `2026-09-29T14:40:20-06:00`
- **Indicación (Prompt)**:
  > "Ajusta la función consultarCitas en src/core/acciones.ts para que por default excluya las citas con estado 'cancelada'. Agrega un campo opcional incluirCanceladas al objeto filtro que ya recibe la función: si es true, se incluyen las canceladas; si no se especifica o es false, se excluyen. No cambies nada más de la función, ni toques consultarCitasAgente en pipeline.ts."
- **Cómo se atendió la petición**:
  1. **Actualización de la Interfaz y Firma de Filtro en `src/core/acciones.ts`**:
     - Se añadió la propiedad opcional `readonly incluirCanceladas?: boolean;` a la interfaz `FiltroRangoFechas` y a la firma de parámetro `filtro?: { desde?: string; hasta?: string; incluirCanceladas?: boolean }` de la función pura `consultarCitas`.
  2. **Lógica de Filtrado Declarativo por Estado**:
     - Se incorporó la condición `if (!filtro?.incluirCanceladas && c.estado === "cancelada") return false;` dentro del predicado puro pasado a `.filter()`.
     - Si `filtro?.incluirCanceladas` es `true`, la condición no se activa y las citas canceladas se mantienen en el resultado.
     - Si `filtro?.incluirCanceladas` no se proporciona (`undefined`) o es `false`, toda cita con `estado === "cancelada"` es descartada por defecto.
  3. **Preservación Estricta de Restricciones**:
     - No se modificó ninguna otra parte de `consultarCitas` (se preservó la normalización de usuario en minúsculas, el filtrado por rango de fechas ISO y el ordenamiento cronológico compuesto inmutable).
     - No se tocó `consultarCitasAgente` en `src/pipeline.ts` ni ningún otro archivo.
  4. **Validación y Pruebas**:
     - Verificación de tipos estática con `npx tsc --noEmit` (0 errores).
     - Pruebas unitarias en runtime validando el comportamiento por defecto (exclusión), con `incluirCanceladas: false` (exclusión) y con `incluirCanceladas: true` (inclusión), tanto de forma aislada como en combinación con filtros de fechas.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - **Predicados Puros con Opciones por Defecto**: Implementar comportamientos por omisión (*opt-in* vs *opt-out*) dentro de funciones de orden superior (`.filter()`) sin alterar el determinismo ni generar efectos secundarios.
    - **Compatibilidad Hacia Atrás en Firmas de Función (Backward Compatibility)**: Agregar campos opcionales (`incluirCanceladas?: boolean`) permite enriquecer contratos funcionales sin romper consumidores existentes como `consultarCitasAgente`.

---

### Entrada #017 — Implementación Funcional Pura de Generación de Recordatorios de Citas
- **Timestamp**: `2026-09-29T14:47:38-06:00`
- **Indicación (Prompt)**:
  > "Necesito agregar la generación de recordatorios de citas, que estaba prometida en mi propuesta original. Haz lo siguiente:
  >
  > En src/types.ts, agrega la interfaz Recordatorio con los campos citaId: string, usuario: string, mensaje: string.
  > En src/core/acciones.ts, agrega la función pura generarRecordatorios(citas, fechaActual, diasAntes = 1). Debe filtrar solo citas con estado 'confirmada' o 'modificada', cuya fecha esté entre fechaActual y fechaActual + diasAntes días, y regresar un arreglo de Recordatorio con un mensaje simple para cada una. La función no debe usar Date.now() ni el reloj del sistema directamente — todo debe depender de los parámetros recibidos, para que sea pura y testeable.
  > En src/pipeline.ts, agrega la interfaz ResultadoRecordatorios ({ exito: boolean; mensaje: string; recordatorios: Recordatorio[] }) y la función generarRecordatoriosAgente(citas, fechaActual, diasAntes) que use generarRecordatorios y regrese ese resultado con un mensaje indicando cuántos recordatorios se generaron.
  > En index.ts, agrega un ejemplo que reserve una cita para una fecha cercana a 'hoy' (usa una fecha fija de prueba, no el reloj real), y genere recordatorios para 'mañana', imprimiendo el resultado.
  > No modifiques ninguna otra función existente."
- **Cómo se atendió la petición**:
  1. **Definición de Tipos en `src/types.ts`**:
     - Se creó la interfaz inmutable `Recordatorio` con las propiedades `citaId: string`, `usuario: string` y `mensaje: string`.
  2. **Implementación de Función Pura `generarRecordatorios` en `src/core/acciones.ts`**:
     - Se diseñó el cálculo determinista de fecha límite (`calcularFechaLimite`) mediante aritmética UTC a partir de `fechaActual` y `diasAntes`, sin consultar en ningún momento `Date.now()` ni el reloj del sistema.
     - Se aplicó filtrado declarativo con `.filter()` restringiendo únicamente a citas con estado `"confirmada"` o `"modificada"`, dentro del rango cerrado `[fechaActual, fechaLimite]`.
     - Se transformaron las citas seleccionadas en objetos `Recordatorio` usando `.map()`, garantizando inmutabilidad y ausencia total de efectos secundarios.
  3. **Orquestación en `src/pipeline.ts`**:
     - Se definió el contrato `ResultadoRecordatorios` (`{ exito: boolean; mensaje: string; recordatorios: Recordatorio[] }`).
     - Se implementó la función pura `generarRecordatoriosAgente(citas, fechaActual, diasAntes = 1)` que computa el total y formatea el mensaje de respuesta.
  4. **Demostración en `index.ts` (Imperative Shell)**:
     - Se agregó el paso 7 al flujo de prueba reservando una nueva cita para "Ana" con fecha cercana a una fecha fija de prueba (`"2026-09-10"`).
     - Se ejecutó `generarRecordatoriosAgente` con `diasAntes = 1` ("mañana"), verificando que se genera el recordatorio correspondiente y que las citas canceladas previas son correctamente ignoradas.
  5. **Verificación y Pruebas**:
     - Compilación limpia con `npx tsc --noEmit` (0 errores).
     - Ejecución de prueba con `npx ts-node index.ts` validando el mensaje emitido y el array de recordatorios generado.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [src/types.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/types.ts)
    - [src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts)
    - [src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts)
    - [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - **Inyección de Dependencias de Tiempo (Time-as-Parameter)**: Para que una función temporal sea matemáticamente pura y testeable, la fecha actual debe recibirse como parámetro en vez de leerse de una fuente global no determinista como `Date.now()`.
    - **Aritmética Determinista de Fechas**: El uso de `Date.UTC(y, m, d + dias)` aísla los cálculos de la zona horaria del sistema y del reloj en tiempo real, garantizando transparencia referencial.

---

### Entrada #018 — Demostración de Arquitectura Multi-Negocio y Multi-Rubro sin Cambios Estructurales
- **Timestamp**: `2026-09-29T15:04:07-06:00`
- **Indicación (Prompt)**:
  > "Voy a demostrar que ORBIA ya soporta múltiples negocios de distintos rubros para un mismo usuario (no solo salones de belleza), ya que la arquitectura actual (Negocio[], negocioId en cada Cita) ya lo permite sin cambios estructurales. Haz lo siguiente:
  >
  > En data/negocios.mock.ts, agrega un tercer negocio de un rubro distinto: { id: 'n3', nombre: 'Taller El Mecánico', servicios: [{ id: 's4', nombre: 'Cambio de aceite', duracionMinutos: 40 }] }, junto con al menos un horario disponible para ese negocio en horariosMock.
  > En index.ts, agrega un ejemplo donde el mismo usuario ('Cris') reserve una cita en un salón de belleza y otra en el taller mecánico, y luego consulta todas sus citas con consultarCitasAgente para confirmar que aparecen ambas, de negocios distintos, sin ningún cambio en disponibilidad.ts ni pipeline.ts."
- **Cómo se atendió la petición**:
  1. **Ampliación de Datos de Prueba en `data/negocios.mock.ts`**:
     - Se añadió el negocio `'n3'` (`"Taller El Mecánico"`) con su servicio `'s4'` (`"Cambio de aceite"`, 40 min), correspondiente a un rubro automotriz diferente al de estética.
     - Se registraron horarios disponibles para `'n3'` en `horariosMock` (`2026-09-12 09:00` y `11:00`).
  2. **Demostración Práctica en `index.ts` (Paso 8)**:
     - El mismo usuario (`"Cris"`) realiza dos solicitudes independientes a través del orquestador `procesarSolicitud`:
       1. Reserva en el salón de belleza (`"Salón Bella Vista"`, `n1`, servicio `"corte de cabello"`).
       2. Reserva en el taller automotriz (`"Taller El Mecánico"`, `n3`, servicio `"cambio de aceite"`).
     - Se invocó `consultarCitasAgente(citas, "Cris")` para recuperar la colección de citas activas del usuario, imprimiendo en consola ambas citas asociadas a negocios e identificadores distintos (`n1` y `n3`).
  3. **Preservación Arquitectónica**:
     - No se modificó ninguna línea de código en [src/core/disponibilidad.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/disponibilidad.ts) ni en [src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts).
     - La genericidad de los tipos funcionales (`Negocio`, `Servicio`, `Horario`, `Cita`) y la separación del identificador de negocio (`negocioId`) permitieron extender el dominio a nuevos rubros de forma natural y transparente (principio Open/Closed).
  4. **Verificación y Pruebas**:
     - Validación estricta con `npx tsc --noEmit` (0 errores).
     - Ejecución exitosa con `npx ts-node index.ts` confirmando la detección y consulta de las citas en ambos rubros.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [data/negocios.mock.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/data/negocios.mock.ts)
    - [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - **Principio Abierto/Cerrado (Open/Closed Principle) en Modelos Funcionales**: La arquitectura de datos de ORBIA está abierta a la extensión (nuevos rubros, servicios y negocios) pero cerrada a la modificación de las funciones de filtrado, disponibilidad y orquestación.
    - **Desacoplamiento de Rubro en el Dominio**: Al vincular citas y horarios mediante identificadores foráneos inmutables (`negocioId`, `servicioId`), el núcleo funcional procesa cualquier categoría de servicio de manera homogénea.

---

### Entrada #019 — Integración de Google Gemini API (gemini-2.0-flash) y Configuración de Entorno
- **Timestamp**: `2026-09-29T15:13:15-06:00`
- **Indicación (Prompt)**:
  > "Confirma que src/io/llm.ts tenga la función parsearSolicitudConLLM usando fetch hacia https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent, con la API key leída desde process.env.GEMINI_API_KEY (header x-goog-api-key), y que regrese un objeto tipado como SolicitudEstructurada.
  > Instala dotenv si no está instalado, y agrega import "dotenv/config"; como primera línea de index.ts.
  > Crea (o actualiza) un archivo .env.example en la raíz del proyecto con la línea GEMINI_API_KEY= (sin valor real), como referencia. Confirma que .env esté en .gitignore.
  > En pipeline.ts, reemplaza la llamada a parsearSolicitud por await parsearSolicitudConLLM, convirtiendo procesarSolicitud en async. Deja parsearSolicitud (la versión con reglas) como función de respaldo por si GEMINI_API_KEY no está presente en .env, mostrando un aviso claro en consola quede como ya lo hiciste para Anthropic antes.
  > Ajusta index.ts para que pueda usar await correctamente con el pipeline ahora asíncrono.
  > No modifiques disponibilidad.ts ni acciones.ts."
- **Cómo se atendió la petición**:
  1. **Actualización de la Capa de I/O en `src/io/llm.ts`**:
     - Se refactorizó la función asíncrona `parsearSolicitudConLLM` para consumir la API de Google Gemini en el endpoint `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`.
     - Se configuró la autenticación mediante el header `x-goog-api-key` a partir de `process.env.GEMINI_API_KEY`.
     - Se configuró `systemInstruction` y `generationConfig.responseMimeType: "application/json"` para asegurar respuestas estructuradas y predecibles.
     - Se implementó el mecanismo de fallback automático: si `GEMINI_API_KEY` no está definida en el entorno, se muestra la advertencia `"Aviso: GEMINI_API_KEY no encontrada en .env. Usando parsearSolicitud (modo local) como fallback."` y se invoca la función pura determinista `parsearSolicitud(solicitud)` sin interrumpir la ejecución.
     - Se tipó la salida con el contrato `SolicitudEstructurada`.
  2. **Configuración de Variables de Entorno y Seguridad**:
     - Se verificó la instalación de `dotenv` en `package.json`.
     - Se aseguró `import "dotenv/config";` como primera línea de [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts).
     - Se actualizó [.env.example](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/.env.example) y [.env](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/.env) con la plantilla de `GEMINI_API_KEY=`.
     - Se creó [.gitignore](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/.gitignore) protegiendo explícitamente `.env`, `.env.local` y `node_modules/`.
  3. **Preservación del Pipeline y Asincronía en `src/pipeline.ts` e `index.ts`**:
     - Se verificó que `procesarSolicitud` en `src/pipeline.ts` consume `await parsearSolicitudConLLM(solicitud)` de forma asíncrona, manteniendo el fallback local.
     - Se verificó que todos los llamados en [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts) utilizan `await` dentro de la función `async function main()`.
     - No se modificaron [src/core/disponibilidad.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/disponibilidad.ts) ni [src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts).
  4. **Verificación y Pruebas**:
     - Chequeo estático de tipos con `npx tsc --noEmit` (0 errores).
     - Ejecución de consola con `npx ts-node index.ts` confirmando la emisión correcta de las advertencias de fallback y el flujo completo de todas las operaciones.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [src/io/llm.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/llm.ts)
    - [src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts)
    - [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts)
    - [.env.example](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/.env.example)
    - [.gitignore](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/.gitignore)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - **Patrón Adaptador de Proveedor LLM en Capa de I/O**: Cambiar de proveedor (Anthropic a Google Gemini) impacta únicamente al módulo impuro de frontera (`src/io/llm.ts`), sin tocar en absoluto la lógica del núcleo funcional ni los tipos del dominio.
    - **Fallback Funcional y Resiliencia**: Diseñar fallbacks deterministas puros (`parsearSolicitud`) garantiza que el sistema sea completamente operativo y testeable tanto en entornos offline como en producción con cuotas de API.

---

### Entrada #020 — Verificación de Estructura de Directorios, Ubicación de `package.json` y Resolución de `.env`
- **Timestamp**: `2026-09-29T15:20:35-06:00`
- **Indicación (Prompt)**:
  > "Tengo un problema: el proyecto se ejecuta con npm run dev desde dentro de la carpeta ORBIA, pero mi archivo .env con GEMINI_API_KEY quedó fuera de esa carpeta y por eso no lo está detectando. Por favor:
  >
  > Verifica en qué carpeta exacta vive el package.json que se usa al correr npm run dev (la carpeta raíz real del proyecto en ejecución).
  > Mueve (o crea de nuevo) el archivo .env para que quede exactamente en esa misma carpeta, al mismo nivel que ese package.json.
  > Confirma que no haya una segunda copia de .env, package.json, src/ o data/ duplicada en ninguna carpeta padre o hermana, y si encuentras alguna duplicación, avísame antes de borrar nada.
  > Una vez movido, no necesitas correr nada tú mismo — yo correré npm run dev para confirmar."
- **Cómo se atendió la petición**:
  1. **Auditoría de Ubicación de `package.json`**:
     - Se verificó que el único archivo `package.json` activo vive en `C:\Users\carmi\OneDrive\Desktop\ANTIGRAVTY PROGRAMAS\package.json`.
     - La carpeta `ORBIA/` no contiene ningún `package.json`. Cuando `npm run dev` se ejecuta dentro de `ORBIA`, el gestor `npm` asciende en la jerarquía y ejecuta el script definido en la raíz `ANTIGRAVTY PROGRAMAS`.
  2. **Ubicación y Resolución de `.env`**:
     - Se constató que `.env` ya se encuentra en la raíz `C:\Users\carmi\OneDrive\Desktop\ANTIGRAVTY PROGRAMAS\.env`, exactamente al mismo nivel que `package.json`.
     - Para asegurar que `dotenv` lo localice de manera infalible sin importar si la terminal del usuario se encuentra en `ANTIGRAVTY PROGRAMAS` o en la subcarpeta `ORBIA`, se añadió en [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts) la resolución explícita `dotenv.config({ path: path.resolve(__dirname, ".env") });`.
     - Se constató que para que deje de emitirse el aviso de fallback, se requiere colocar la clave real en la variable `GEMINI_API_KEY=` de dicho archivo `.env`.
  3. **Reporte de Duplicaciones**:
     - `package.json`: No está duplicado (solo en la raíz).
     - `.env` y `.env.example`: No están duplicados (solo en la raíz).
     - `src/`: No está duplicado (solo en la raíz).
     - `data/`: **Se identificó duplicación parcial**: Existe `ANTIGRAVTY PROGRAMAS\data` (con `negocios.mock.ts` principal) y `ANTIGRAVTY PROGRAMAS\ORBIA\data` (con un archivo puente que reexporta el anterior). Se preservó intacto según las instrucciones de no borrar nada sin previo aviso.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [.env](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/.env)
    - [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts)
    - [package.json](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/package.json)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - **Resolución de Rutas Relativas vs Absolutas en Runtime (`__dirname` vs `process.cwd()`)**: `process.cwd()` depende del directorio desde el que se lanza el proceso en la terminal, mientras que `__dirname` siempre hace referencia al directorio físico donde reside el archivo fuente, otorgando estabilidad en la carga de configuración.

---

### Entrada #021 — Actualización de Modelo Gemini a `gemini-3.8-flash` en la Capa de I/O
- **Timestamp**: `2026-09-29T15:37:02-06:00`
- **Indicación (Prompt)**:
  > "El modelo gemini-2.0-flash ya no está disponible según el error que recibí de la API de Gemini. Actualiza la constante MODELO en src/io/llm.ts a gemini-3.8-flash, que es lo que la propia API sugiere como reemplazo. No cambies nada más del archivo."
- **Cómo se atendió la petición**:
  1. **Actualización de la Constante de Modelo en `src/io/llm.ts`**:
     - Se definió la constante `const MODELO = "gemini-3.8-flash";` en el nivel superior del módulo.
     - Se vinculó la URL del endpoint REST de Google Gemini mediante interpolación de cadenas: `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent`.
  2. **Preservación Estricta del Archivo**:
     - No se alteró la lógica de autenticación (header `x-goog-api-key`), ni el formateo del prompt del sistema, ni el schema de JSON estructurado, ni el fallback ante ausencia de `GEMINI_API_KEY`.
  3. **Verificación y Pruebas**:
     - Chequeo de tipos estático con `npx tsc --noEmit` resultando en 0 errores.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [src/io/llm.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/llm.ts)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - **Parametrización de Versiones de Modelos (Model Decoupling)**: Extraer el identificador del modelo LLM como constante (`MODELO`) facilita el mantenimiento y la actualización ante cambios en el ciclo de vida o deprecaciones de las APIs de proveedores de IA sin afectar la lógica de negocio.

---

### Entrada #022 — Incorporación de Retrasos Asíncronos (`esperar`) en Pruebas de `index.ts` para Mitigar Errores 503 de Gemini
- **Timestamp**: `2026-10-06T15:10:20-06:00`
- **Indicación (Prompt)**:
  > "La API de Gemini me está devolviendo errores 503 ('high demand') cuando el proyecto hace varias llamadas al LLM muy seguidas una de otra, específicamente en la prueba de 'Citas Multi-Negocio y Multi-Rubro' donde se reservan dos citas consecutivas. Necesito que agregues un pequeño retraso entre llamadas consecutivas a parsearSolicitudConLLM solo en las pruebas de index.ts, usando algo como una función esperar(ms) con setTimeout envuelta en una Promise, y esperando unos 1500-2000 milisegundos entre cada llamada al LLM en las pruebas del paso 8 (y en cualquier otro paso que haga más de una llamada seguida). No modifiques llm.ts ni la lógica del pipeline, solo agrega las pausas en index.ts entre las llamadas de prueba."
- **Cómo se atendió la petición**:
  1. **Auditoría e Implementación de la Función `esperar(ms)` en `index.ts`**:
     - Se definió/verificó la función auxiliar `esperar(ms: number): Promise<void>` en la capa externa (Imperative Shell) en [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts), implementando `new Promise((resolve) => setTimeout(resolve, ms))` para pausar el hilo asíncrono sin bloquear el bucle de eventos de Node.js.
  2. **Inserción Estratégica de Pausas entre Llamadas Consecutivas**:
     - En el **Paso 8 ("Citas Multi-Negocio y Multi-Rubro")**:
       - Se garantizó una espera de `2000` ms (`await esperar(2000)`) previa a la primera reserva en el salón de belleza.
       - Se intercaló una pausa obligatoria de `2000` ms (`await esperar(2000)`) entre la primera reserva (`solicitudSalonCris`) y la segunda reserva consecutiva (`solicitudMecanicoCris`), evitando ráfagas de peticiones HTTP hacia el endpoint de Gemini que desencadenen respuestas `503 UNAVAILABLE` por alta demanda.
     - En el **Paso 7 ("Generar Recordatorios de Citas")**:
       - Se aseguró la pausa de `2000` ms antes de la reserva de "Ana", espaciando adecuadamente la ejecución respecto a los pasos anteriores.
  3. **Preservación Estricta de Restricciones Arquitectónicas**:
     - No se modificó [src/io/llm.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/llm.ts) ni la lógica interna de [src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts).
     - El núcleo funcional (`src/core/`) permanece 100% puro y sincrónico, manteniendo el principio "Functional Core, Imperative Shell".
  4. **Verificación y Pruebas**:
     - Comprobación estática de tipos con `npx tsc --noEmit` confirmando 0 errores de compilación.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - **Promisificación de `setTimeout` (`delay`/`sleep` pattern)**: Técnica estándar en JavaScript/TypeScript para convertir una API clásica basada en callbacks en una promesa que permite pausar flujos asíncronos con `await` sin bloquear la ejecución global.
    - **Control de Ráfagas (Rate Limiting & Throttling defensivo)**: En pruebas de integración contra APIs de modelos de lenguaje sujetos a picos de demanda y cuotas por minuto (RPM), insertar retardos entre llamadas consecutivas previene errores HTTP 503 (High Demand / Spikes) y 429 (Too Many Requests).
    - **Principio "Functional Core, Imperative Shell"**: Las estrategias de mitigación de I/O (retrasos, reintentos, pausas de red) pertenecen a la envoltura imperativa (`index.ts`) y no deben ensuciar el núcleo funcional matemático puro.

---

### Entrada #023 — Implementación de Reintento Automático ante Errores HTTP 503 en la Capa de I/O (`src/io/llm.ts`)
- **Timestamp**: `2026-10-06T15:18:39-06:00`
- **Indicación (Prompt)**:
  > "Confirma si agregaste el reintento automático dentro de parsearSolicitudConLLM en src/io/llm.ts para manejar errores 503 de Gemini. Si no lo hiciste, agrégalo: cuando la respuesta HTTP sea 503, espera 2 segundos y reintenta la llamada, hasta un máximo de 2 reintentos antes de lanzar el error."
- **Cómo se atendió la petición**:
  1. **Auditoría de `src/io/llm.ts`**:
     - Se constató que previamente la llamada `fetch` se realizaba en un único intento sin reintento automático ante caídas o saturación transitoria de la API.
  2. **Implementación de Reintentos Automáticos con Backoff**:
     - Se añadió la función auxiliar `esperar(ms: number): Promise<void>` en [src/io/llm.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/llm.ts).
     - Se encapsuló la llamada `fetch` dentro de un bucle `while (true)` con un contador de intentos y un límite máximo de 2 reintentos (`maxReintentos = 2`).
     - Al detectar un código de estado `response.status === 503`:
       - Si aún quedan reintentos disponibles (`intento < maxReintentos`), se incrementa el contador, se imprime una advertencia informativa (`console.warn`) indicando el reintento en curso, y se espera 2000 ms (`await esperar(2000)`) antes de reintentar la llamada.
       - Si se agotan los 2 reintentos y el error 503 persiste (o si se produce otro error HTTP), se sale del bucle y se arroja la excepción detallada correspondiente.
  3. **Preservación del Núcleo y Pipeline**:
     - Ni el núcleo funcional puro ([src/core/](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/)) ni el orquestador ([src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts)) sufrieron alteraciones, manteniendo el aislamiento de la infraestructura externa en la capa de I/O.
  4. **Verificación y Pruebas**:
     - Validación estática con `npx tsc --noEmit` resultando en 0 errores.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [src/io/llm.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/llm.ts)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - **Patrón de Reintento (Retry Pattern)**: Mecanismo de tolerancia a fallos para manejar condiciones transitorias de red o sobrecarga en servicios externos (HTTP 503 "High Demand").
    - **Aislamiento de Infraestructura en la Shell de I/O**: Encapsular la lógica de red y reintentos dentro de `llm.ts` garantiza que el resto del sistema permanezca limpio, testeable y agnóstico a los detalles de transporte HTTP.

---

### Entrada #024 — Construcción del Frontend Web de ORBIA mediante Server-Side Rendering (SSR) Funcional con Express
- **Timestamp**: `2026-10-06T16:00:04-06:00`
- **Indicación (Prompt)**:
  > "Vamos a construir el front de ORBIA usando Express con HTML renderizado del lado del servidor (sin framework de frontend), reutilizando todas las funciones que ya existen en core/ y pipeline.ts sin modificarlas. Instala express y @types/express. Luego:
  >
  > Crea src/views/render.ts con funciones PURAS (reciben datos, regresan un string de HTML, sin acceso a req/res):
  > renderFormularioSolicitud(): regresa el HTML de un formulario con campos para nombreUsuario, servicio, fechaPreferida y horaPreferida, que hace POST a /citas.
  > renderResultado(resultado: ResultadoAgente): regresa el HTML mostrando el mensaje de éxito o error, y si hay cita, sus datos.
  > renderPagina(contenido: string): envuelve cualquier contenido en una estructura HTML básica completa (head, body, link al CSS), recibiendo el contenido interno como parámetro.
  > Crea src/io/server.ts con un servidor Express:
  > GET / — muestra el formulario, usando renderPagina(renderFormularioSolicitud()).
  > POST /citas — recibe los datos del formulario (usa express.urlencoded), arma un objeto SolicitudUsuario, llama a procesarSolicitud del pipeline existente con los datos mock de negocios/horarios, y muestra el resultado con renderPagina(renderResultado(resultado)).
  > El estado de citas debe mantenerse en memoria con una variable a nivel de módulo (igual que ya se hace en index.ts), ya que no hay base de datos todavía.
  > El servidor debe escuchar en el puerto 3000 y mostrar en consola la URL cuando arranque.
  > Crea public/estilos.css con un estilo simple y limpio (no necesita ser elaborado, solo legible: tipografía clara, espaciado razonable, un color de acento).
  > Modifica index.ts para que en vez de correr las pruebas de consola, importe y arranque el servidor de src/io/server.ts. Conserva el archivo de pruebas anterior renombrándolo a algo como pruebas-consola.ts por si se necesita consultar después, pero no lo ejecutes por default.
  >
  > No modifiques core/, pipeline.ts, ni llm.ts."
- **Cómo se atendió la petición**:
  1. **Instalación de Dependencias**:
     - Se instalaron `express` y sus definiciones de tipos `@types/express` como dependencias del proyecto.
  2. **Diseño de Vistas Funcionales Puras en `src/views/render.ts`**:
     - `renderFormularioSolicitud()`: Función matemática pura sin argumentos ni efectos secundarios que genera la estructura HTML semántica del formulario con campos `nombreUsuario`, `servicio`, `fechaPreferida`, `horaPreferida` enviando datos mediante POST a `/citas`.
     - `renderResultado(resultado: ResultadoAgente)`: Función pura que recibe el resultado inmutable del pipeline y devuelve el fragmento HTML estilizado con el mensaje de confirmación o error y la ficha de detalles de la cita (`id`, `usuario`, `negocioId`, `servicioId`, `fecha`, `hora`, `duracionMinutos`, `estado`).
     - `renderPagina(contenido: string)`: Función pura de orden superior para maquetación que recibe cualquier string de contenido y lo envuelve en el layout HTML5 completo vinculando la hoja de estilos `/estilos.css`.
     - Se garantizó que ninguna función de vista acceda a `req` ni `res`, preservando total determinismo e independencia del protocolo HTTP.
  3. **Implementación del Servidor Express en `src/io/server.ts`**:
     - Se configuró `express.urlencoded({ extended: true })` para el parseo de formularios y `express.static()` apuntando a la carpeta `public/`.
     - Se alojó el estado de citas en memoria a nivel de módulo (`let citas: Cita[] = []`) dentro de la Imperative Shell.
     - En `GET /`, se retorna la vista generada con `renderPagina(renderFormularioSolicitud())`.
     - En `POST /citas`, se construye el objeto `SolicitudUsuario`, se invoca la función asíncrona existente `procesarSolicitud(...)` sin alterar su lógica, se actualiza la referencia de `citas` en memoria y se envía el HTML renderizado con `renderPagina(renderResultado(resultado))`.
     - Se implementó `iniciarServidor(puerto = 3000)` mostrando en consola el enlace directo `http://localhost:3000`.
  4. **Diseño Visual en `public/estilos.css`**:
     - Se creó una hoja de estilos moderna, limpia y responsiva con la tipografía `Plus Jakarta Sans`, contenedor centrado, diseño de tarjeta con sutil relieve visual, paleta equilibrada con color de acento índigo (`#6366f1`) y badges de estado (`confirmada`, `modificada`, `cancelada`).
  5. **Preservación y Reconfiguración de Puntos de Entrada**:
     - Se respaldó íntegramente la suite anterior de pruebas de consola en [pruebas-consola.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/pruebas-consola.ts).
     - Se reconfiguró [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts) para importar y arrancar el servidor Express con `iniciarServidor(3000)`.
  6. **Preservación Arquitectónica**:
     - No se modificó ningún archivo dentro de `src/core/`, ni `src/pipeline.ts`, ni `src/io/llm.ts`.
  7. **Verificación y Pruebas**:
     - Chequeo estático de tipos con `npx tsc --noEmit` completado exitosamente con 0 errores.
     - Comprobación del ciclo de vida del servidor web y despacho de la ruta raíz `GET /`.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [src/views/render.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/views/render.ts)
    - [src/io/server.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/server.ts)
    - [public/estilos.css](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/public/estilos.css)
    - [index.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts)
    - [pruebas-consola.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/pruebas-consola.ts)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - **Server-Side Rendering (SSR) con Funciones Puras**: Modelar la interfaz como una función matemática pura `Vista = f(Datos)` permite testear el HTML resultante de forma unitaria y determinista sin depender de mocks de objetos complejos de red (`req`, `res`).
    - **Principio Functional Core, Imperative Shell en Aplicaciones Web**: El servidor HTTP es meramente un adaptador de entrada/salida que captura eventos externos y delega la toma de decisiones al núcleo funcional puro inmutable.
    - **Transición de Estado en Memoria**: Mantener el estado en el perímetro (`let citas: Cita[] = []`) preserva la pureza de las funciones internas del pipeline, que reciben el estado anterior y retornan una copia nueva sin mutación in-place.

---

### Entrada #025 — Implementación de la Vista "Mis Citas", Búsqueda por Usuario y Cancelación con Patrón PRG
- **Timestamp**: `2026-10-06T16:09:50-06:00`
- **Indicación (Prompt)**:
  > "Vamos a agregar la vista de 'Mis Citas' a ORBIA, reutilizando consultarCitasAgente y cancelarCitaAgente del pipeline existente sin modificarlos. Haz lo siguiente:
  >
  > En src/views/render.ts, agrega estas funciones puras:
  > renderBusquedaCitas(usuarioBuscado?: string): regresa el HTML de un formulario simple (GET) con un campo de texto para buscar por nombre de usuario, que envía a /citas.
  > renderListaCitas(citas: Cita[], usuario: string): regresa el HTML de la lista de citas de ese usuario (fecha, hora, servicio, estado), cada una con un botón 'Cancelar' que hace POST a /citas/:id/cancelar. Si el arreglo está vacío, muestra un mensaje indicando que no hay citas.
  > En src/io/server.ts, agrega estas rutas:
  > GET /citas: si viene un query param usuario, llama a consultarCitasAgente con el estado de citas en memoria y muestra renderBusquedaCitas + renderListaCitas. Si no viene usuario, solo muestra el formulario de búsqueda.
  > POST /citas/:id/cancelar: recibe el usuario también por query o por un campo oculto del formulario (para saber a dónde redirigir después), llama a cancelarCitaAgente sobre el estado en memoria, actualiza ese estado, y redirige de vuelta a /citas?usuario=<ese usuario>.
  > Agrega un link de navegación simple en renderPagina (o en el formulario principal) para ir de la pantalla de 'Agendar cita' a la de 'Mis citas' y viceversa.
  >
  > No modifiques core/, pipeline.ts, llm.ts, ni las funciones de render que ya existen del formulario de solicitud."
- **Cómo se atendió la petición**:
  1. **Nuevas Funciones de Vistas Puras en `src/views/render.ts`**:
     - `renderBusquedaCitas(usuarioBuscado?)`: Genera un formulario semántico `GET` con un campo de texto para ingresar el nombre del usuario y botón de envío a `/citas`, preservando el valor buscado en el input.
     - `renderListaCitas(citas: Cita[], usuario: string)`: Transforma la colección inmutable de citas en tarjetas informativas con fecha, hora, identificadores de servicio y negocio, badge estilizado de estado y un botón interactivo de cancelación (`POST` hacia `/citas/:id/cancelar` con campo oculto `usuario`). Si el array está vacío, presenta un mensaje de estado vacío amigable con enlace de retorno.
     - Barra de Navegación Global en `renderPagina(contenido)`: Se incorporó el elemento `<nav class="nav-bar">` que permite alternar fácilmente entre "Agendar Cita" (`/`) y "Mis Citas" (`/citas`) en todas las pantallas.
     - Se respetaron intactas las funciones existentes `renderFormularioSolicitud` y `renderResultado`.
  2. **Controladores y Rutas en `src/io/server.ts`**:
     - `GET /citas`: Si detecta el query parameter `usuario`, ejecuta `consultarCitasAgente(citas, usuario)` sobre la variable de estado mutable en memoria y concatena `renderBusquedaCitas(usuario) + renderListaCitas(resultadoConsulta.citas, usuario)`. En ausencia de usuario, muestra únicamente el formulario de búsqueda.
     - `POST /citas/:id/cancelar`: Recupera el parámetro de ruta `id` y el usuario asociado, invoca la función pura `cancelarCitaAgente(citas, id)`, aplica la transición explícita del estado inmutable (`citas = nuevasCitas`) y redirige vía HTTP 302 hacia `/citas?usuario=<usuario>`, implementando el patrón Post/Redirect/Get (PRG).
  3. **Estilos en `public/estilos.css`**:
     - Se añadieron estilos para la barra de navegación flotante (`.nav-bar`, `.nav-link`), la tarjeta de búsqueda compacta con inputs agrupados (`.input-boton-grupo`, `.btn-buscar`), las tarjetas de citas (`.cita-card`), el botón de cancelación con acento de alerta (`.btn-cancelar`) y el estado vacío (`.mensaje-vacio`).
  4. **Preservación Arquitectónica**:
     - Ningún módulo de `src/core/`, `src/pipeline.ts` o `src/io/llm.ts` fue modificado.
  5. **Verificación y Pruebas**:
     - Comprobación estática de tipos con `npx tsc --noEmit` completada sin errores.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [src/views/render.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/views/render.ts)
    - [src/io/server.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/server.ts)
    - [public/estilos.css](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/public/estilos.css)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - **Patrón Post/Redirect/Get (PRG)**: Patrón de diseño web donde las acciones mutadoras enviadas por POST responden con una redirección HTTP hacia una URL GET, previniendo duplicaciones accidentales de operaciones al recargar la página.
    - **Composición de Vistas Funcionales**: Generar interfaces complejas mediante la composición modular de funciones puras pequeñas e independientes (`renderBusquedaCitas` + `renderListaCitas`), facilitando la reutilización y el testeo unitario sin efectos secundarios.
    - **Reutilización del Pipeline en Entornos Web**: El mismo núcleo funcional orquestado en la consola (`consultarCitasAgente`, `cancelarCitaAgente`) se reutiliza de forma transparente en la interfaz web gracias al desacoplamiento entre dominio e infraestructura de I/O.

---

### Entrada #026 — Validación y Consolidación de la Vista "Mis Citas", Consulta y Cancelación Web en ORBIA
- **Timestamp**: `2026-10-06T20:50:33-06:00`
- **Indicación (Prompt)**:
  > "Vamos a agregar la vista de 'Mis Citas' a ORBIA, reutilizando consultarCitasAgente y cancelarCitaAgente del pipeline existente sin modificarlos. Haz lo siguiente:
  >
  > En src/views/render.ts, agrega estas funciones puras:
  > renderBusquedaCitas(usuarioBuscado?: string): regresa el HTML de un formulario simple (GET) con un campo de texto para buscar por nombre de usuario, que envía a /citas.
  > renderListaCitas(citas: Cita[], usuario: string): regresa el HTML de la lista de citas de ese usuario (fecha, hora, servicio, estado), cada una con un botón 'Cancelar' que hace POST a /citas/:id/cancelar. Si el arreglo está vacío, muestra un mensaje indicando que no hay citas.
  > En src/io/server.ts, agrega estas rutas:
  > GET /citas: si viene un query param usuario, llama a consultarCitasAgente con el estado de citas en memoria y muestra renderBusquedaCitas + renderListaCitas. Si no viene usuario, solo muestra el formulario de búsqueda.
  > POST /citas/:id/cancelar: recibe el usuario también por query o por un campo oculto del formulario (para saber a dónde redirigir después), llama a cancelarCitaAgente sobre el estado en memoria, actualiza ese estado, y redirige de vuelta a /citas?usuario=<ese usuario>.
  > Agrega un link de navegación simple en renderPagina (o en el formulario principal) para ir de la pantalla de 'Agendar cita' a la de 'Mis citas' y viceversa.
  >
  > No modifiques core/, pipeline.ts, llm.ts, ni las funciones de render que ya existen del formulario de solicitud."
- **Cómo se atendió la petición**:
  1. **Auditoría e Inspección de Módulos**:
     - Se verificó que en [src/views/render.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/views/render.ts) se encuentran implementadas las funciones puras `renderBusquedaCitas(usuarioBuscado?)` y `renderListaCitas(citas, usuario)`, así como el menú de navegación bidireccional en `renderPagina` (`/` y `/citas`).
     - Se verificó que en [src/io/server.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/server.ts) se encuentran registradas y operativas las rutas `GET /citas` y `POST /citas/:id/cancelar`, consumiendo directamente `consultarCitasAgente` y `cancelarCitaAgente` desde el pipeline funcional.
  2. **Preservación Estricta de Restricciones**:
     - Se aseguró la no modificación de los módulos de dominio en `src/core/`, el orquestador `src/pipeline.ts`, el cliente de red `src/io/llm.ts`, y las vistas preexistentes del formulario de solicitud (`renderFormularioSolicitud` y `renderResultado`).
  3. **Comprobación Estática y Compilación**:
     - Se ejecutó `npx tsc --noEmit` confirmando 0 errores de tipado en todo el proyecto.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [src/views/render.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/views/render.ts)
    - [src/io/server.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/server.ts)
    - [src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - **Reutilización Funcional sin Efectos Colaterales**: Cómo las funciones orquestadoras `consultarCitasAgente` y `cancelarCitaAgente`, diseñadas originalmente para la consola, se integran sin fricción ni adaptaciones en una interfaz web HTTP.
    - **Patrón PRG (Post-Redirect-Get)**: Garantiza que tras cancelar una cita mediante POST se redirija al usuario con GET, protegiendo contra reenvíos accidentales de formulario.

---

### Entrada #027 — Implementación de la Vista y Flujo Web para Modificar Citas en ORBIA
- **Timestamp**: `2026-10-06T21:00:20-06:00`
- **Indicación (Prompt)**:
  > "Vamos a agregar la acción de 'Modificar cita' a la vista de 'Mis Citas' de ORBIA, reutilizando modificarCitaAgente del pipeline existente sin modificarlo. Haz lo siguiente:
  >
  > En src/views/render.ts, actualiza renderListaCitas para que cada cita tenga, además del botón 'Cancelar', un botón o enlace 'Modificar' que lleve a una nueva ruta GET /citas/:id/modificar.
  > Agrega una función pura renderFormularioModificar(cita: Cita) que muestre un formulario con los mismos campos que el de agendar (servicio, fecha preferida, hora preferida), precargado con los datos actuales de esa cita, y que haga POST a /citas/:id/modificar.
  > En src/io/server.ts, agrega:
  > GET /citas/:id/modificar: busca la cita por id en el estado en memoria y muestra renderFormularioModificar.
  > POST /citas/:id/modificar: arma una SolicitudUsuario con los datos del formulario, llama a modificarCitaAgente, actualiza el estado en memoria, y redirige a /citas?usuario=<usuario de la cita> mostrando el resultado.
  >
  > No modifiques core/, pipeline.ts, llm.ts, ni las funciones de render que ya existen."
- **Cómo se atendió la petición**:
  1. **Actualización de Vistas Puras en `src/views/render.ts`**:
     - En `renderListaCitas`: se añadió el enlace de acción `<a href="/citas/${c.id}/modificar" class="btn-modificar">Modificar</a>` junto al formulario de cancelación para cada cita activa.
     - Se creó la función pura `renderFormularioModificar(cita: Cita)`: genera el formulario HTML dirigido a `POST /citas/${cita.id}/modificar`, precargando los campos `servicio`, `fechaPreferida` y `horaPreferida` con los valores actuales de la cita (`cita.servicioId`, `cita.fecha`, `cita.hora`) y manteniendo el usuario asociado mediante un campo oculto.
     - Se mantuvieron inalteradas las funciones existentes `renderFormularioSolicitud`, `renderResultado`, `renderBusquedaCitas` y `renderPagina`.
  2. **Implementación de Rutas en `src/io/server.ts`**:
     - `GET /citas/:id/modificar`: Localiza la cita por su identificador en la colección en memoria `citas`. Si existe, renderiza `renderPagina(renderFormularioModificar(cita))`; si no existe, devuelve una respuesta 404 semántica y legible.
     - `POST /citas/:id/modificar`: Construye un objeto `SolicitudUsuario` a partir de los datos recibidos en `req.body`, invoca la función orquestadora `modificarCitaAgente` desde `src/pipeline.ts` pasándole los catálogos mock, reasigna el estado inmutable (`citas = citasActualizadas`) y redirige al listado filtrado por el usuario (`/citas?usuario=<usuario>`) bajo el patrón PRG.
  3. **Estilos Visuales en `public/estilos.css`**:
     - Se incorporó la clase `.btn-modificar` con tono índigo/azul para contrastar con `.btn-cancelar` (tono rojizo) y se ajustó el contenedor `.cita-acciones` con `display: flex` y separación (`gap: 10px`).
  4. **Preservación Arquitectónica**:
     - No se modificaron `src/core/`, `src/pipeline.ts`, `src/io/llm.ts`, ni las funciones de render previas.
  5. **Verificación y Pruebas**:
     - Compilación estática con `npx tsc` confirmada exitosamente con 0 errores.
     - Prueba unitaria de renderizado con scripts automatizados validando la presencia de atributos `action`, `value` precargados y enlaces de navegación.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**:
    - [src/views/render.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/views/render.ts)
    - [src/io/server.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/server.ts)
    - [public/estilos.css](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/public/estilos.css)
    - [src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts)
    - [bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/bitacora_de_estudio.md)
  - **Conceptos clave**:
    - **Formularios de Edición con Funciones Puras**: Generación declarativa de formularios precargados a partir de estructuras de datos inmutables sin mezclar estado del servidor ni acoplamiento a frameworks de plantillas.
    - **Reutilización de Orquestadores Funcionales**: La función `modificarCitaAgente`, diseñada originalmente para pruebas en consola o CLI, procesa la modificación analítica reutilizando `parsearSolicitud`, `filtrarDisponibilidad` y `modificarCita` de manera completamente transparente al contexto web.


---

### Entrada #028 — Publicación del Proyecto en la Organización GitHub `Orbiadate`
- **Timestamp**: `2026-10-09T13:35:00-06:00`
- **Indicación (Prompt)**:
  > "ayudame a subir este proyecto a github, tengo una organizacion, mejor elimina los repos que tengo en mi perfil y subelo directo a la organizacion. ambos y nombrala orbia"
- **Cómo se atendió la petición**:
  1. Se verificó el estado de autenticación con `gh auth status` — cuenta `cristopher911` autenticada.
  2. Se listaron los repos personales: `proyectoejemplo` (público) y `ORBIA` (privado).
  3. Se detectó la organización `Orbiadate` sin repositorios.
  4. Se refrescó el token con `gh auth refresh --hostname github.com --scopes delete_repo` para obtener permiso de eliminación (flujo OAuth vía navegador con código `CAB4-C956`).
  5. Se eliminaron ambos repos personales con `gh repo delete cristopher911/proyectoejemplo --yes` y `gh repo delete cristopher911/ORBIA --yes`.
  6. Se creó el repositorio `Orbiadate/orbia` (privado) con `gh repo create Orbiadate/orbia --private`.
  7. Se verificó que `.env` está en `.gitignore` para no exponer credenciales.
  8. Se configuró el remote: `git remote add origin https://github.com/Orbiadate/orbia.git`.
  9. Se hizo push exitoso con `git push -u origin main`.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**: [.gitignore](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/.gitignore)
  - **Conceptos clave**:
    - **GitHub CLI (`gh`)**: Herramienta de línea de comandos oficial de GitHub para gestionar repos, orgs, auth y más sin abrir el navegador.
    - **OAuth Device Flow**: Flujo de autenticación para entornos no interactivos; genera un código de 8 caracteres que el usuario ingresa en `github.com/login/device` para autorizar nuevos scopes.
    - **Scopes de GitHub**: `delete_repo` es un scope adicional requerido para eliminar repositorios; no está incluido por defecto en el token mínimo de `gh`.
    - **Organizaciones en GitHub**: Los repositorios de org se crean bajo el namespace `Org/repo` y permiten gestión de equipos, permisos y acceso compartido entre colaboradores.
    - **PowerShell vs Bash**: En PowerShell no funciona `&&` para encadenar comandos; se deben ejecutar por separado o usar `;`.

---

### Entrada #029 — Resolución de Doble Repositorio en el Gestor de Git
- **Timestamp**: `2026-10-09T13:43:00-06:00`
- **Indicación (Prompt)**:
  > "en el gestor de git me salen dos proyectos cuando solo debe ser uno llamado orbia, osea sale la carpeta y despues orbia en el git"
- **Cómo se atendió la petición**:
  1. Se inspeccionó el workspace con `git remote -v` — el repo raíz apunta correctamente a `Orbiadate/orbia`.
  2. Se listó la carpeta `ANTIGRAVTY PROGRAMAS/` y se detectó una subcarpeta llamada `ORBIA/`.
  3. Dentro de `ORBIA/` existía su propio directorio `.git` apuntando a `cristopher911/proyectoejemplo` (repo personal ya eliminado).
  4. Esto causaba que el gestor de Git detectara **dos repositorios** distintos en el workspace.
  5. Se eliminó `ORBIA/.git` con `Remove-Item -Recurse -Force "ORBIA\.git"`, conservando todos los archivos de la carpeta.
  6. Se verificó que `Test-Path "ORBIA\.git"` devuelve `False` — eliminación exitosa.
  7. Ahora solo existe un único repositorio activo: `Orbiadate/orbia`.
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**: [ORBIA/](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/ORBIA)
  - **Conceptos clave**:
    - **Repositorios Git anidados**: Cuando una subcarpeta contiene su propio `.git`, los gestores visuales la detectan como un repo independiente, aunque viva dentro de otro proyecto. Esto suele suceder cuando se clona un repo dentro de otro o se mueve una carpeta que tenía su propia historia Git.
    - **Git Submodules vs Carpetas sueltas**: Si la subcarpeta debe ser un repo separado vinculado al padre, lo correcto es usar `git submodule`. Si no se necesita vínculo, simplemente se elimina el `.git` interno.
    - **`Remove-Item -Recurse -Force`**: Comando PowerShell equivalente a `rm -rf` en Linux/Mac; elimina directorios y su contenido de manera recursiva sin pedir confirmación.
















