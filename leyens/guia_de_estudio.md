# 📘 Guía Maestra de Estudio por Semanas — Proyecto ORBIA
## Programación Funcional aplicada a un Agente de IA para Agendamiento de Citas

> **Propósito de esta Guía**:  
> Este documento organiza cronológica y temáticamente **todas las indicaciones (prompts), decisiones arquitectónicas, conceptos teóricos y piezas de código** desarrolladas a lo largo del proyecto **ORBIA**.  
> Ha sido diseñado para servir como herramienta integral de estudio, repaso conceptual y preparación para el examen y defensa oral ante el profesor.

---

## 🗺️ Mapa Curricular por Semanas

| Semana | Fechas Clave | Prompts Cubiertos | Núcleo Temático y Archivos Principales |
| :---: | :---: | :---: | :--- |
| **Semana 1** | Septiembre 8, 2026 | #001, #002, #003 | Fundamentos de PF, Selección Tecnológica y Modelado Inmutable de Tipos ([src/types.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/types.ts)) |
| **Semana 2** | Septiembre 8, 2026 | #004 | Funciones Puras, Parsing Determinista y Transparencia Referencial ([src/core/parse.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/parse.ts)) |
| **Semana 3** | Septiembre 9, 2026 | #005 | Funciones de Orden Superior (HOFs), Disponibilidad y Copias Defensivas ([src/core/disponibilidad.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/disponibilidad.ts)) |
| **Semana 4** | Septiembre 9, 2026 | #006, #007 | CRUD Inmutable, Transición de Estado (Reducer) y Eliminación de Estado Global ([src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts)) |
| **Semana 5** | Septiembre 13, 2026 | #008, #009 | Arquitectura *Pure Core / Impure Shell*, Pipeline Funcional e Integración Asíncrona con LLM Claude ([src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts), [src/io/llm.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/llm.ts)) |
| **Semana 6** | Septiembre 22, 2026 | #010, #011 | Documentación Técnica Integral, Diagramas de Arquitectura y Guía Maestra ([README.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/README.md), [guia_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/guia_de_estudio.md)) |

---

## 📅 SEMANA 1: Fundamentos de PF, Selección Tecnológica y Modelado Inmutable

### 1. Indicaciones (Prompts) de la Semana
- **Prompt #001 (2026-09-08)**:
  > *"-usa la bitacora de estudio para crear para crear el material y cada indicacion {prompt} grabala ahi con tu respuesta (como atendiste la peticion) -crea un skill para realizar esta bitacora y actualizala en cada indicacion que te de, agrega un timestamp"*
  - **Objetivo**: Establecer la infraestructura de registro incremental pedagógico (`.agents/skills/bitacora-estudio/SKILL.md` y `bitacora_de_estudio.md`).
- **Prompt #002 (2026-09-08)**:
  > *"Quiero que me ayudes a hacer un proyecto que me dejó el profesor de programación funcional. Voy a mandarte la propuesta del proyecto (ORBIA, un agente de IA para agendar citas) y las instrucciones del profesor. Vamos a desarrollarlo en Antigravity IDE. Revisa en qué lenguaje conviene hacerlo."*
  - **Objetivo**: Evaluar los pros y contras de lenguajes (Haskell, Elixir, Python, TypeScript) bajo la óptica de la Programación Funcional y el ecosistema de IA.
- **Prompt #003 (2026-09-08)**:
  > *"me puedes ayudar a auto acompletar código types.ts,"*
  - **Objetivo**: Diseñar los contratos de tipos del sistema modelando inmutabilidad con `readonly`, uniones discriminadas y el tipo algebraico `Result<T, E>`.

---

### 2. Marco Teórico y Conceptos Clave
#### ¿Qué es la Programación Funcional (PF)?
Es un paradigma de programación declarativo donde el cómputo se concibe como la evaluación de **funciones matemáticas puras**, evitando el estado mutable compartido y los efectos secundarios.

```
Imperativo (POO Tradicional):           Funcional (Enfoque ORBIA):
┌───────────────────────────────┐       ┌───────────────────────────────┐
│ Objeto con Estado Mutable     │       │ Datos Inmutables (Inalterables)│
│  cita.estado = "cancelada";   │  VS   │       │                       │
│ (Mutación destructiva in-situ)│       │       ▼ (Función Pura)        │
│                               │       │ Nuevo Estado Generado         │
└───────────────────────────────┘       └───────────────────────────────┘
```

#### Inmutabilidad en TypeScript: ¿Por qué `const` no basta?
- `const` únicamente congela la **referencia** en memoria de la variable, pero el objeto sigue siendo mutable:
  ```typescript
  const cita = { id: "c1", estado: "confirmada" };
  cita.estado = "cancelada"; // ¡Válido en JS estándar, pero rompe el paradigma funcional!
  ```
- Para garantizar inmutabilidad a nivel de tipos, se utiliza el modificador `readonly`:
  ```typescript
  export interface Cita {
    readonly id: string;
    readonly estado: EstadoCita; // El compilador rechaza cualquier asignación directa
  }
  ```

#### Tipos Algebraicos de Datos (ADTs) y Patrón `Result`
En programación funcional pura se evita lanzar excepciones (`throw new Error()`) porque son no-deterministas e invisibles en la firma de una función. En su lugar, se representan los posibles resultados mediante una unión discriminada:
```typescript
export type Result<T, E = string> =
  | { readonly ok: true; readonly valor: T }
  | { readonly ok: false; readonly error: E };
```

---

### 3. Código Fuente Representativo ([src/types.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/types.ts))
```typescript
export type EstadoCita = "confirmada" | "cancelada" | "modificada" | "pendiente";

export type FranjaHora = "manana" | "tarde" | "noche" | "sin_especificar";
export type FranjaFecha = "hoy" | "manana" | "esta_semana" | "sin_especificar";

export interface Horario {
  readonly id?: string;
  readonly negocioId: string;
  readonly servicioId: string;
  readonly fecha: string;
  readonly hora: string;
  readonly disponible: boolean;
}

export interface SolicitudUsuario {
  readonly nombreUsuario: string;
  readonly servicio: string;
  readonly fechaPreferida: string;
  readonly horaPreferida: string;
}
```

---

### 4. Preguntas Típicas de Examen Oral (Semana 1)
- **Pregunta**: *¿Por qué elegiste TypeScript para un curso de Programación Funcional si no es un lenguaje puramente funcional como Haskell?*
  - **Respuesta**: *Porque TypeScript permite aplicar un **enfoque funcional estricto** utilizando `readonly`, tipos algebraicos con uniones discriminadas y funciones puras, a la vez que cuenta con integración nativa con los SDKs y llamadas HTTP a modelos de lenguaje (LLMs).*
- **Pregunta**: *¿Qué problema resuelve el tipo `Result<T, E>` frente a un bloque `try/catch`?*
  - **Respuesta**: *`Result<T, E>` convierte el fallo en un valor de primer orden explícito en la firma de la función. Obliga al llamador a manejar el error sin interrumpir el flujo de ejecución mediante saltos abruptos en el stack de llamadas.*

---

## 📅 SEMANA 2: Funciones Puras, Parsing Determinista y Transparencia Referencial

### 1. Indicaciones (Prompts) de la Semana
- **Prompt #004 (2026-09-08)**:
  > *"en parse requiero que Convierte una SolicitudUsuario (texto libre) en una SolicitudEstructurada. Es una función pura: misma entrada -> misma salida, sin efectos secundarios."*
  - **Objetivo**: Crear un parser analítico determinista en [src/core/parse.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/parse.ts) que transforme la solicitud libre a una estructura normalizada sin realizar llamadas externas.

---

### 2. Marco Teórico y Conceptos Clave
#### Anatomía de una Función Pura
Una función $f: A \to B$ es **pura** si cumple dos axiomas:
1. **Determinismo (Misma Entrada $\to$ Misma Salida)**:
   $$\forall x, \quad f(x) = f(x)$$
   No depende de factores externos variables (`Math.random()`, `Date.now()`, estado de base de datos).
2. **Cero Efectos Secundarios (*Side-Effect Free*)**:
   No produce mutaciones observables fuera de su ámbito local:
   - No imprime en consola (`console.log`).
   - No muta variables globales ni parámetros recibidos por referencia.
   - No efectúa peticiones de red o escritura en disco.

#### Transparencia Referencial
Una expresión posee **transparencia referencial** si puede ser reemplazada por su valor evaluado sin que el comportamiento global del programa se altere.
*Ejemplo*: Si `parsearSolicitud(solicitudEjemplo)` produce `{ servicio: "corte", franjaHora: "tarde" }`, podemos sustituir la llamada por ese valor en cualquier punto del código sin consecuencias ocultas.

---

### 3. Código Fuente Representativo ([src/core/parse.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/parse.ts))
```typescript
const PALABRAS_TARDE = ["tarde"];
const PALABRAS_MANANA = ["mañana", "manana"];
const PALABRAS_NOCHE = ["noche"];

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

---

### 4. Preguntas Típicas de Examen Oral (Semana 2)
- **Pregunta**: *¿Por qué no llamamos al LLM directamente dentro de `parse.ts` desde el inicio?*
  - **Respuesta**: *Porque una llamada a una API externa (I/O) es impura, asíncrona y no determinista. Mantener un parser analítico puro en `src/core/` permite probar las reglas de normalización de forma instantánea, aislada y sin costo de red.*

---

## 📅 SEMANA 3: Funciones de Orden Superior (HOFs) y Lógica de Disponibilidad

### 1. Indicaciones (Prompts) de la Semana
- **Prompt #005 (2026-09-09)**:
  > *"donde te pedi en disponibilidad que lo auto completaras hiciste con programacion funcional??"*
  - **Objetivo**: Auditar [src/core/disponibilidad.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/disponibilidad.ts) verificando la ausencia de bucles imperativos (`for`, `while`) y la erradicación del antipatrón de mutación destructiva de `.sort()`.

---

### 2. Marco Teórico y Conceptos Clave
#### Funciones de Orden Superior (Higher-Order Functions - HOFs)
Son funciones que:
- Reciben una o más funciones como argumentos (predicados, callbacks).
- Y/o retornan una función como resultado.

En ORBIA, los bucles imperativos `for (let i = 0; i < n; i++)` fueron totalmente sustituidos por HOFs declarativas de colecciones:
- `.filter(predicado)`: Conserva solo los elementos para los cuales el predicado retorna `true`.
- `.find(predicado)`: Retorna el primer elemento que satisface el predicado.
- `.some(predicado)`: Evalúa si al menos un elemento cumple la condición.

#### El Peligro Oculto de `.sort()` en JavaScript
En la especificación ECMAScript, el método nativo `Array.prototype.sort()` **muta el arreglo original en su lugar (*in-place*)**.
```typescript
// ❌ MUTACIÓN DESTRUCTIVA IMPURA:
const horarios = [{ hora: "18:00" }, { hora: "10:00" }];
horarios.sort(...); // ¡Modifica el arreglo original en memoria!
```
Para cumplir con la pureza funcional, se utiliza una **copia defensiva**:
```typescript
// ✅ COPIA DEFENSIVA FUNCIONAL:
export function elegirMejorHorario(opciones: Horario[]): Horario | undefined {
  return [...opciones].sort((a, b) => a.hora.localeCompare(b.hora))[0];
}
```
Al hacer `[...opciones]`, se crea un nuevo arreglo en memoria antes de ordenar, preservando el arreglo original intacto.

---

### 3. Código Fuente Representativo ([src/core/disponibilidad.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/disponibilidad.ts))
```typescript
function horaEnFranja(hora: string, franja: SolicitudEstructurada["franjaHora"]): boolean {
  const h = parseInt(hora.split(":")[0], 10);
  if (franja === "manana") return h >= 6 && h < 12;
  if (franja === "tarde") return h >= 12 && h < 19;
  if (franja === "noche") return h >= 19 || h < 6;
  return true;
}

export function filtrarDisponibilidad(
  horarios: Horario[],
  negocios: Negocio[],
  solicitud: SolicitudEstructurada
): Horario[] {
  return horarios.filter((h) => {
    if (!h.disponible) return false;

    const negocio = negocios.find((n) => n.id === h.negocioId);
    const servicio = negocio?.servicios.find((s: Servicio) => s.id === h.servicioId);
    if (!servicio) return false;

    const coincideServicio = servicio.nombre
      .toLowerCase()
      .includes(solicitud.servicio);

    return coincideServicio && horaEnFranja(h.hora, solicitud.franjaHora);
  });
}
```

---

### 4. Preguntas Típicas de Examen Oral (Semana 3)
- **Pregunta**: *¿Por qué `.sort()` es considerado un antipatrón peligroso en programación funcional en JavaScript?*
  - **Respuesta**: *Porque `.sort()` muta el arreglo original in-situ (*in-place*), lo cual es un efecto colateral destructivo. En programación funcional pura debemos hacer una copia previa antes de ordenar con el operador spread `[...arr].sort(...)` o usar métodos inmutables modernos como `toSorted()`.*

---

## 📅 SEMANA 4: CRUD Inmutable, Transición de Estado y Eliminación de Estado Global

### 1. Indicaciones (Prompts) de la Semana
- **Prompt #006 (2026-09-09)**:
  > *"en el documento de index me puedes decir si esta bien estructurado para los proximos documentos dentro del programa"*
  - **Objetivo**: Revisar la arquitectura general de `index.ts` y sentar las bases para la orquestación pura y las fuentes de datos mock.
- **Prompt #007 (2026-09-09)**:
  > *"en el documento de acciones necesito que hagas el la conmsulta de las citas en programacion funcional y tambien necesito que pongas una funcion de citas para que se puedan cancelar -si el archivo le falta algo extra para estar completo agregalo y en la bitacora pon lo que hizo falta para despues leerlo"*
  - **Objetivo**: Implementar en [src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts) las 4 operaciones del dominio (`reservar`, `consultar`, `cancelar`, `modificar`) y erradicar variables mutables compartidas (`let contador = 0`).

---

### 2. Marco Teórico y Conceptos Clave
#### Modelado de Estado como Función de Transición (Patrón Reducer)
En programación funcional no modificamos objetos existentes; calculamos el nuevo estado del sistema a través de funciones puras:
$$\text{NuevoEstado} = f(\text{EstadoActual}, \text{Acción})$$

1. **Inserción Inmutable**: En vez de `citas.push(nuevaCita)`, devolvemos `[...citasActuales, nuevaCita]`.
2. **Actualización Inmutable con `.map()`**: Recorre la colección; si el ID coincide, devuelve una copia con los campos modificados; si no, devuelve el elemento sin tocar.

#### Erradicación de Antipatrones de Estado Global
En versiones preliminares existía el antipatrón:
```typescript
// ❌ IMPURO: Dependencia de memoria mutable externa
let contador = 0;
function generarId() {
  contador++; // Rompe la transparencia referencial
  return `cita-${contador}`;
}
```
Se sustituyó por una función pura y determinista:
```typescript
// ✅ PURO: Basado estrictamente en la longitud del estado actual
export function generarIdPuro(citasActuales: readonly Cita[]): string {
  return `cita-${citasActuales.length + 1}`;
}
```

---

### 3. Código Fuente Representativo ([src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts))
```typescript
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

  return [...citasActuales, nuevaCita];
}

export function cancelarCita(citasActuales: readonly Cita[], citaId: string): Cita[] {
  return citasActuales.map((c) =>
    c.id === citaId ? { ...c, estado: "cancelada" } : c
  );
}

export function consultarCitas(citasActuales: readonly Cita[], usuario: string): readonly Cita[] {
  return citasActuales.filter((c) => c.usuario.toLowerCase() === usuario.toLowerCase());
}

export function modificarCita(
  citasActuales: readonly Cita[],
  citaId: string,
  nuevosDatos: Partial<Pick<Cita, "fecha" | "hora" | "servicioId">>
): Cita[] {
  return citasActuales.map((c) =>
    c.id === citaId ? { ...c, ...nuevosDatos, estado: "modificada" } : c
  );
}
```

---

### 4. Preguntas Típicas de Examen Oral (Semana 4)
- **Pregunta**: *¿Cómo actualizas una cita en una lista inmutable sin usar `citas[i].estado = "cancelada"`?*
  - **Respuesta**: *Utilizamos la función de orden superior `.map()`. Esta evalúa cada cita y retorna un nuevo arreglo donde el elemento objetivo es reemplazado por una copia superficial con el nuevo estado (`{ ...c, estado: "cancelada" }`), preservando todas las demás citas intactas.*

---

## 📅 SEMANA 5: Arquitectura "Pure Core / Impure Shell", Pipeline e Integración con LLM

### 1. Indicaciones (Prompts) de la Semana
- **Prompt #008 (2026-09-13)**:
  > *"necesito que en la bitacora de estudio me crees una guia de estudio de todo lo que hicimos pero crealo por semanas aunque sea separa los promps y dame una guiia completa y si ves que hace falta algo autocompletalo de informacion"*
  - **Objetivo**: Diseñar la primera versión curricular de la guía de estudio dentro de la bitácora y consolidar el pipeline.
- **Prompt #009 (2026-09-13)**:
  > *"Voy a implementar la Fase 3 de mi proyecto ORBIA siguiendo el patrón de pure core / impure shell que investigué para aplicar los conceptos de Programación Funcional. Necesito que crees el archivo src/io/llm.ts con una función parsearSolicitudConLLM que: Reciba un objeto SolicitudUsuario, arme un prompt de sistema que pida SOLO JSON, haga la llamada HTTP a Anthropic usando fetch y ANTHROPIC_API_KEY, y regrese tipada como SolicitudEstructurada. Todo lo demás en core/ debe seguir siendo puro. Actualiza pipeline.ts e index.ts con async/await e instala dotenv."*
  - **Objetivo**: Integrar el LLM de Anthropic (`claude-3-haiku-20240307`) confinado estrictamente a la capa de I/O impura (`src/io/llm.ts`), convirtiendo el pipeline a asíncrono sin contaminar la pureza de `src/core/`.

---

### 2. Marco Teórico y Conceptos Clave
#### Patrón Arquitectónico: Functional Core, Imperative Shell
Propuesto por Gary Bernhardt, este patrón establece que:
1. **Functional Core (Núcleo Funcional)**: Contiene toda la lógica de negocio y decisiones complejas. Está compuesto por funciones 100% puras, síncronas y testeables.
2. **Imperative Shell (Envoltura Imperativa)**: Recibe las entradas del mundo exterior, maneja la concurrencia, realiza las llamadas I/O (HTTP, base de datos) y alimenta con datos crudos al núcleo.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        IMPERATIVE SHELL (index.ts)                     │
│  - Carga variables de entorno (.env vía dotenv)                        │
│  - Captura la solicitud del usuario                                    │
│  - Mantiene la referencia mutable: let citas: Cita[]                   │
│                                                                        │
│       ┌────────────────────────────────────────────────────────┐       │
│       │                  CAPA DE I/O (src/io/llm.ts)           │       │
│       │   - Llamada HTTP fetch a Anthropic API (Efecto I/O)    │       │
│       │   - Extracción de JSON estructurado                    │       │
│       └────────────────────────────────────────────────────────┘       │
│                                  │                                     │
│                                  ▼                                     │
│       ┌────────────────────────────────────────────────────────┐       │
│       │               FUNCTIONAL CORE (src/core/)              │       │
│       │   - filtrarDisponibilidad() (Pura)                     │       │
│       │   - elegirMejorHorario()    (Pura)                     │       │
│       │   - reservarCita()          (Pura)                     │       │
│       └────────────────────────────────────────────────────────┘       │
│                                  │                                     │
│  - Imprime resultado por consola (console.log)                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Código Fuente Representativo

#### 3.1 Cliente de I/O Impura ([src/io/llm.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/llm.ts))
```typescript
export async function parsearSolicitudConLLM(
  solicitud: SolicitudUsuario
): Promise<SolicitudEstructurada> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Variable de entorno ANTHROPIC_API_KEY no encontrada.");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 256,
      system: "Eres un extractor de datos para ORBIA... devuelve ÚNICAMENTE JSON válido.",
      messages: [{ role: "user", content: JSON.stringify(solicitud) }],
    }),
  });

  const data = (await response.json()) as AnthropicResponse;
  const rawText = data.content?.[0]?.text?.trim() ?? "{}";
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);

  return {
    nombreUsuario: parsed.nombreUsuario || solicitud.nombreUsuario,
    intencion: "agendar",
    servicio: (parsed.servicio || solicitud.servicio).toLowerCase().trim(),
    franjaFecha: parsed.franjaFecha || "sin_especificar",
    franjaHora: parsed.franjaHora || "sin_especificar",
    fechaPreferida: solicitud.fechaPreferida,
    horaPreferida: solicitud.horaPreferida,
  };
}
```

#### 3.2 Pipeline Orquestador ([src/pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts))
```typescript
export async function procesarSolicitud(
  solicitud: SolicitudUsuario,
  negocios: Negocio[],
  horarios: Horario[],
  citasActuales: Cita[]
): Promise<{ resultado: ResultadoAgente; citas: Cita[] }> {
  // 1. Capa de I/O asíncrona (Shell exterior)
  const estructurada = await parsearSolicitudConLLM(solicitud);

  // 2. Núcleo funcional puro (sin I/O)
  const opciones = filtrarDisponibilidad(horarios, negocios, estructurada);
  const mejorOpcion = elegirMejorHorario(opciones);

  if (!mejorOpcion) {
    return {
      resultado: {
        exito: false,
        mensaje: `No encontré disponibilidad para "${solicitud.servicio}" en la franja solicitada.`,
      },
      citas: citasActuales,
    };
  }

  // 3. Transición de estado inmutable
  const nuevasCitas = reservarCita(citasActuales, solicitud.nombreUsuario, mejorOpcion);
  const citaCreada = nuevasCitas[nuevasCitas.length - 1];

  return {
    resultado: {
      exito: true,
      mensaje: `Cita confirmada para ${solicitud.nombreUsuario} el ${citaCreada.fecha} a las ${citaCreada.hora}.`,
      cita: citaCreada,
    },
    citas: nuevasCitas,
  };
}
```

---

### 4. Preguntas Típicas de Examen Oral (Semana 5)
- **Pregunta**: *¿Por qué el uso de un LLM no viola los principios de la Programación Funcional en ORBIA?*
  - **Respuesta**: *Porque aplicamos el patrón **Functional Core, Imperative Shell**. La llamada no determinista al LLM está estrictamente aislada en el borde exterior del sistema (`src/io/llm.ts`). Las funciones de dominio que calculan la disponibilidad y reservan las citas en `src/core/` no tienen idea de cómo se obtuvo el JSON y permanecen 100% puras.*

---

## 📅 SEMANA 6: Documentación Técnica, Diagramas y Guía Maestra

### 1. Indicaciones (Prompts) de la Semana
- **Prompt #010 (2026-09-22)**:
  > *"puedes hacer un readm.md de todo el programa que estamos realizando"*
  - **Objetivo**: Crear el archivo de documentación principal del proyecto ([README.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/README.md)) con diagramas Mermaid, tablas de conceptos, árbol de directorios y guía de ejecución.
- **Prompt #011 (2026-09-22)**:
  > *"ahora quiero que hagas guia de estudio basada en la bitacora de todo lo que te pedido hazlo en un archivo md por semanas de lo que te pedi hasta dodne llegue"*
  - **Objetivo**: Consolidar la presente guía curricular por semanas en un archivo Markdown independiente ([guia_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/guia_de_estudio.md)) que cubra exhaustivamente toda la trayectoria del proyecto.

---

### 2. Marco Teórico y Conceptos Clave
#### Arquitectura de Software Funcional Documentada
Un proyecto de software funcional requiere que los límites entre capas puras e impuras estén formalmente documentados:
1. **Contratos de Interfaz Transparentes**: Toda función describe con exactitud sus entradas y salidas mediante tipos inmutables.
2. **Determinismo Verificable**: Las pruebas unitarias del núcleo no requieren *mocks* complejos de red, bases de datos o servicios en la nube; basta con suministrar datos de prueba en memoria.

---

### 3. Resumen Global de Clasificación de Módulos

| Archivo | Capa Arquitectónica | ¿Es Puro? | Justificación Funcional |
| :--- | :--- | :---: | :--- |
| [`src/types.ts`](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/types.ts) | Definición de Dominio | N/A | Tipos estáticos inmutables con `readonly` y `Result<T, E>`. |
| [`src/core/parse.ts`](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/parse.ts) | Functional Core | **SÍ (100%)** | Función determinista basada en reglas sin I/O. |
| [`src/core/disponibilidad.ts`](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/disponibilidad.ts) | Functional Core | **SÍ (100%)** | HOFs declarativas (`.filter`) y copia defensiva `[...arr].sort()`. |
| [`src/core/acciones.ts`](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts) | Functional Core | **SÍ (100%)** | Reducers puros de citas; `generarIdPuro` determinista. |
| [`src/io/llm.ts`](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/llm.ts) | Capa I/O Impura | **NO** | Llamada HTTP a Anthropic, variables de entorno y asincronía. |
| [`src/pipeline.ts`](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts) | Orquestador | **Híbrido** | Invoca I/O externa y canaliza el resultado hacia el core puro. |
| [`index.ts`](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/index.ts) | Imperative Shell | **NO** | Contiene el estado mutable `let citas = []` y `console.log`. |

---

## 🎓 Banco Maestro de Preguntas y Respuestas para el Examen Oral

### P1: "¿Qué es un efecto secundario (side effect) y por qué se prohíbe en el núcleo funcional?"
- **Respuesta**: *"Un efecto secundario es cualquier modificación del estado del sistema observable fuera del contexto de la función (ej. escribir en disco, alterar una variable global, mutar un parámetro recibido por referencia, imprimir en consola o hacer una petición HTTP). Se prohíben en el núcleo funcional porque destruyen el determinismo matemático, hacen que el código sea difícil de razonar y multiplican los errores al introducir dependencias temporales y de estado oculto."*

### P2: "¿Por qué en JavaScript `const arr = []` no garantiza inmutabilidad real?"
- **Respuesta**: *"`const` en JavaScript únicamente congela la dirección de memoria asignada a la variable, pero el objeto subyacente sigue siendo mutable. Se le pueden agregar elementos mediante `arr.push(x)`. Para lograr inmutabilidad funcional real en TypeScript empleamos `readonly T[]` en tiempo de compilación y el operador spread `[...arr, x]` en tiempo de ejecución para generar nuevos arreglos."*

### P3: "¿Qué diferencia existe entre una función pura y una función determinista?"
- **Respuesta**: *"Toda función pura es determinista, pero no toda función determinista es pura. Una función determinista siempre devuelve el mismo resultado para los mismos argumentos, pero podría generar efectos secundarios (como imprimir en consola o guardar un log). Una función **pura** debe cumplir ambas condiciones: ser determinista Y carecer totalmente de efectos secundarios."*

### P4: "¿Qué es la transparencia referencial y cómo se evidencia en `src/core/disponibilidad.ts`?"
- **Respuesta**: *"Es la propiedad de una expresión o función que permite reemplazarla por su valor computado sin alterar el comportamiento global del software. En `disponibilidad.ts`, la función `filtrarDisponibilidad` depende únicamente de los argumentos recibidos (`horarios`, `negocios`, `solicitud`); no consulta ninguna base de datos ni variable externa, por lo que su llamada puede ser sustituida por la lista de horarios filtrados en cualquier momento."*

### P5: "¿Cómo gestiona ORBIA la mutabilidad del estado de las citas a lo largo del tiempo?"
- **Respuesta**: *"Utiliza el patrón de transiciones de estado inmutables (tipo Reducer). Las funciones en `src/core/acciones.ts` (`reservarCita`, `cancelarCita`, `modificarCita`) reciben el arreglo de citas actual y retornan uno nuevo con el cambio aplicado mediante `.map()` o el operador spread `[...citasActuales, nuevaCita]`. La única variable que muta es `let citas` en el archivo `index.ts` (la Shell imperativa), donde se reasigna la referencia devuelta por el pipeline."*

### P6: "¿Cómo se implementa el patrón Functional Core, Imperative Shell en la integración con Claude Haiku?"
- **Respuesta**: *"La llamada a la API de Anthropic mediante `fetch` es inherentemente impura (depende de la red, credenciales y latencia). Esta llamada fue aislada en `src/io/llm.ts`. Una vez que el LLM extrae el JSON normalizado, este se transfiere a `src/core/disponibilidad.ts` y `src/core/acciones.ts`, las cuales son funciones puras que operan de forma estrictamente determinista en memoria."*

---

## 📖 Glosario Técnico de Programación Funcional

1. **Función Pura (Pure Function)**: Función determinista que para los mismos argumentos siempre retorna el mismo resultado sin generar efectos secundarios observables.
2. **Efecto Secundario (Side Effect)**: Cualquier alteración del estado fuera del ámbito léxico de una función (I/O, mutación de memoria externa).
3. **Transparencia Referencial**: Capacidad de sustituir una llamada a función por su valor de retorno sin cambiar el comportamiento del programa.
4. **Inmutabilidad (Immutability)**: Principio de diseño en el cual los datos no pueden modificarse tras su creación. Las modificaciones generan nuevas estructuras.
5. **Copia Defensiva (Defensive Copy)**: Duplicación de colecciones u objetos (ej. `[...arr]`) previa a operaciones mutadoras nativas como `.sort()`.
6. **Función de Orden Superior (HOF)**: Función que acepta otras funciones como parámetros o retorna una función como resultado.
7. **Unión Discriminada**: Tipo compuesto en TypeScript donde cada variante incluye una propiedad literal común (etiqueta o discriminador) para facilitar el chequeo estricto.
8. **Tipo Algebraico de Datos (ADT)**: Tipo formado mediante composición algebraica (sumas y productos), como `Result<T, E>`.
9. **Patrón Reducer**: Función con firma `(EstadoAnterior, Evento) => NuevoEstado` que encapsula transiciones inmutables de estado.
10. **Functional Core, Imperative Shell**: Patrón de arquitectura que concentra la lógica de negocio en funciones puras y delega el I/O al borde exterior del sistema.
