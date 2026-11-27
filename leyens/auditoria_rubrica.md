# Auditoría de Proyecto ORBIA — Evaluación Estricta contra Rúbrica

> **Fecha y Hora de Auditoría**: 2026-11-27T08:00:00-06:00  
> **Auditor**: Agente de Implementación de ORBIA  
> **Rol del Solicitante**: Arquitecto de Software  
> **Regla de Operación**: Modo solo lectura (revisión, ejecución y diagnóstico sin alterar el código fuente).

---

## Resumen Ejecutivo de Calificaciones

| Criterio | Puntos Máx | Puntaje Estimado | Estado General |
| :--- | :---: | :---: | :--- |
| **1. Paradigma Funcional** | 30 | **25 / 30** | ⚠️ PARCIAL (Cálculos puros excelentes; impureza en fecha y controllers POO) |
| **2. Solución y Flujo** | 20 | **11 / 20** | ⚠️ PARCIAL (README desalineado; front en Fase 3; falta validación de fechas pasadas/slots) |
| **3. Claridad y Orden** | 15 | **11 / 15** | ⚠️ PARCIAL (Tipado estático en verde, pero carpeta duplicada y uso de any/dynamic) |
| **4. Git, Docs y Uso de IA** | 15 | **13 / 15** | 🟢 CUMPLE (Excelente bitácora y .gitignore; verificar org de GitHub) |
| **5. Apropiación y Pruebas** | 20 | **10 / 20** | 🔴 RIESGO ALTO (Sin suite automatizada en backend; README menciona Claude) |
| **BONO** | +5 | **+4 / +5** | 🟢 Multi-lenguaje y modo demo activos; sin Docker |
| **CALIFICACIÓN TOTAL** | **100 (+5)** | **74 / 100 (+4 bono = 78 / 100)** | **Nivel: Aprobatorio con correcciones obligatorias** |

---

## 1. PARADIGMA FUNCIONAL (30 pts) — Calificación: 25 / 30

### 1.1 Separación de Cálculo vs Interfaz e I/O
- **Estado**: 🟢 **CUMPLE** (en Backend) / ⚠️ **PARCIAL** (en Frontend).
- **Evidencia**:
  - **Backend**: El cálculo puro de negocio reside en `src/tools/` ([disponibilidad.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/tools/disponibilidad.ts), [acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/tools/acciones.ts), [auth.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/tools/auth.ts), [parse.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/tools/parse.ts)), sin efectos de red, base de datos ni consola. La capa de transporte y persistencia está confinada en `src/io/` ([server.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/server.ts), [routes/](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/routes), [usuario_repositorio.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/usuario_repositorio.ts)).
  - **Frontend**: La capa HTTP está desacoplada en [lib/features/auth/auth_service.dart](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/lib/features/auth/auth_service.dart). Sin embargo, el estado en Flutter se gestiona mediante `ChangeNotifier` ([estado_sesion.dart](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/lib/features/auth/estado_sesion.dart), [citas_controller.dart](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/lib/features/citas/citas_controller.dart)), el cual responde al patrón Observer de la Programación Orientada a Objetos y muta propiedades internas (`_citas = ...; notifyListeners();`), en lugar de emplear reducers puros o arquitecturas funcionales tipo Redux/BLoC funcional.

### 1.2 Auditoría de Mutaciones, Efectos y Estado Global Mutable
- **Búsqueda ejecutada**: `.push(`, `.splice(`, `.sort(`, `let `, `Date.now`, `Math.random`, `fetch(`, `console.log` en `src/tools/` y `src/core/`.
- **Hallazgos Críticos**:
  1. 🔴 **Impureza temporal en `reservarCita`**:
     - **Archivo**: [src/tools/acciones.ts#L21](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/tools/acciones.ts#L21)
     - **Código**: `creadaEn: new Date().toISOString()`
     - **Problema**: `new Date()` introduce un efecto no determinista. Invocar `reservarCita` dos veces con los mismos argumentos retorna objetos diferentes (viola Transparencia Referencial). Debe recibir `fechaCreacion?: string` como argumento o generarse en el Shell impuro.
  2. ⚠️ **Uso local de `.push()`**:
     - **Archivo**: [src/core/auth.ts#L51](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/auth.ts#L51)
     - **Código**: `const errores: ErrorValidacion[] = []; errores.push(...)`
     - **Mitigación**: Es una variable local efímera y se retorna `Object.freeze(errores)`, pero en rigor funcional debió construirse con acumulación funcional o spread.
  3. 🟢 **Copias Defensivas en `.sort()`**:
     - **Archivo**: [src/tools/acciones.ts#L46](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/tools/acciones.ts#L46) y [src/tools/disponibilidad.ts#L42](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/tools/disponibilidad.ts#L42)
     - **Código**: `return [...opciones].sort((a, b) => a.hora.localeCompare(b.hora))[0];`
     - **Cumplimiento**: Evita mutar el array original clonando con spread antes de ordenar.
  4. 🟢 **Cero llamadas I/O en Core/Tools**:
     - Ninguna función en `src/tools/` contiene `fetch(`, `console.log(`, `Math.random()` ni lectura de `process.env`.

### 1.3 Ejemplos Concretos de Principios Funcionales en el Código
- **Pureza Matemática**: `filtrarDisponibilidad(horarios, negocios, solicitud)` en [src/tools/disponibilidad.ts#L16](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/tools/disponibilidad.ts#L16). Mismo input $\rightarrow$ mismo output sin tocar estado externo.
- **Inmutabilidad**: `cancelarCita` en [src/tools/acciones.ts#L27](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/tools/acciones.ts#L27). Transforma mediante `citasActuales.map(...)` creando un nuevo objeto solo para el elemento modificado.
- **Funciones de Orden Superior (HOFs)**:
  - `.filter()` y `.sort()` en [src/tools/acciones.ts#L38-L46](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/tools/acciones.ts#L38-L46) (`consultarCitas`).
  - `.some()` y `.map()` anidado en [src/tools/acciones.ts#L77-L84](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/tools/acciones.ts#L77-L84) (`registrarDuracionServicio`).
- **Composición / Pipeline**: [src/pipeline.ts#L38-L53](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts#L38-L53). Canaliza: `parsearSolicitud` $\rightarrow$ `filtrarDisponibilidad` $\rightarrow$ `elegirMejorHorario` $\rightarrow$ `reservarCita`.
- **Uniones Discriminadas**: [src/types.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/types.ts) (`EstadoCita = "confirmada" | "cancelada" | "modificada" | "pendiente"`, `FranjaHora`, `FranjaFecha`, `Result<T, E>`).

---

## 2. SOLUCIÓN Y FLUJO (20 pts) — Calificación: 11 / 20

### 2.1 Instalación y Puesta en Marcha Siguiendo Solo el README
- **Estado**: 🔴 **NO CUMPLE**.
- **Evidencia en [README.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY PROGRAMAS/README.md)**:
  1. Línea 143 y 164: Pide configurar `ANTHROPIC_API_KEY=sk-ant-api03-...` en `.env`. Sin embargo, el código real en [src/io/gemini_client.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/gemini_client.ts) requiere `GEMINI_API_KEY`.
  2. Líneas 169 y 182: Afirma que `npm run dev` ejecuta un script de prueba de consola que procesa una solicitud en `index.ts`. En la realidad, `index.ts` inicializa el servidor Express en el puerto 3000 (`iniciarServidor(PUERTO)`).
  3. No contiene ninguna instrucción sobre cómo instalar Flutter, ni el comando para levantar el frontend web (`flutter run -d chrome --web-port 8080`). Un evaluador que clone y lea únicamente el README no podrá levantar el cliente web ni conectar con Gemini.

### 2.2 Prueba del Flujo Completo
- **Backend**: 🟢 **CUMPLE**. Verificado con [pruebas-consola.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/pruebas-consola.ts) y endpoints REST (`POST /api/citas`, `POST /api/citas/:id/modificar`, `POST /api/citas/:id/cancelar`).
- **Frontend (Flutter)**: ⚠️ **PARCIAL**.
  - **Auth (Fase 3)**: Registro, login y cerrar sesión funcionan de punta a punta conectados con JWT al backend.
  - **Citas y Servicios (Fase 2)**: Las pantallas [servicios.dart](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/lib/features/servicios/servicios.dart) y [citas.dart](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/lib/features/citas/citas.dart) son placeholders visuales. No cuentan con el formulario de agendamiento manual ni el chat con IA conectado a la UI (según `FASES.md`, esto corresponde a las Fases 4 y 5 pendientes).

### 2.3 Pruebas de Casos Límite y Errores (Salidas Reales)
Pruebas ejecutadas mediante `ts-node` sobre el motor de reglas:

```text
--- TEST 1: Entrada vacía ---
Entrada: { nombreUsuario: "test", mensajeOriginal: "", servicio: "", fechaPreferida: "", horaPreferida: "" }
Salida: intencion: agendar | servicio: "corte"  (Asigna fallback 'corte' por defecto)

--- TEST 2: Texto sin sentido ---
Entrada: "asdfghjk zxcvbnm"
Salida: intencion: agendar | franjaHora: "sin_especificar"

--- TEST 3: Fecha pasada ("2020-01-01") ---
Entrada: fechaPreferida: "2020-01-01", horaPreferida: "10:00"
Salida real: T3 horarios disponibles para 2020-01-01: 3  [FALLO: Devuelve cupos disponibles para una fecha que ya pasó]

--- TEST 4: Hora fuera de horario ("03:00") ---
Entrada: horaPreferida: "03:00"
Salida real: T4 horarios disponibles para 03:00: 3  [FALLO: Si la franja es 'sin_especificar', retorna slots del día]

--- TEST 5: Negocio inexistente ---
Entrada: negocioId: "negocio-fantasma"
Salida real: T5 horarios negocio inexistente: 0  [CUMPLE: Manejo correcto sin slots]

--- TEST 6: Horario ya ocupado (Doble reserva del mismo slot) ---
Reserva 1: Horario "h1" -> Citas: 1 (Estado: confirmada)
Reserva 2: Mismo horario "h1" -> Citas: 2  [FALLO: 'reservarCita' no valida colisión de horario y duplica la cita]

--- TEST 7: Gemini sin clave o sin internet ---
Ejecución con delete process.env.GEMINI_API_KEY:
Salida real: Modo sin API key: local | Servicio: corte | Modo local: true  [CUMPLE: Fallback resiliente automático]
```

### 2.4 Conexión Front-Backend vs Datos Simulados
- **Autenticación**: 🟢 **100% Real**. Conectado vía HTTP a `http://localhost:3000/auth/login` y `/auth/registro`, validando tokens JWT en `GET /auth/yo`.
- **Servicios, Locales y Citas**: 🔴 **Simulados en Front**. Las pantallas actuales de Flutter no realizan llamadas `GET /api/servicios` ni `GET /api/citas`; sus controladores contienen fallbacks mock en memoria y las vistas actuales ni siquiera consumen los controladores.

---

## 3. CLARIDAD Y ORDEN (15 pts) — Calificación: 11 / 15

### 3.1 Chequeo de Tipos Estáticos
- **TypeScript**: `npx tsc --noEmit` $\rightarrow$ **0 errores**.
- **Flutter**: `flutter analyze` $\rightarrow$ **No issues found!** (0 advertencias, 0 errores en los 22 archivos `.dart`).

### 3.2 Límite de 200 Líneas por Archivo
- **Estado**: 🟢 **CUMPLE AL 100% en Código Fuente**.
  - Todos los archivos `.dart` en `lib/` tienen entre 21 y 160 líneas (el más extenso es [login.dart](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/lib/features/auth/login.dart) con 160).
  - Todos los archivos `.ts` en `src/` tienen entre 4 y 186 líneas (el más extenso es [pipeline.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/pipeline.ts) con 186).
  - Solo los archivos de documentación (`bitacora_de_estudio.md`, `guia_de_estudio.md`), los lockfiles y el CSS legacy superan las 200 líneas.

### 3.3 Uso de `any` y `dynamic`
- **TypeScript**: ⚠️ Encontrado en [src/io/routes/tools.routes.ts#L39-L40](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/routes/tools.routes.ts#L39-L40):
  ```typescript
  franjaHora: (franjaHora as any) || "sin_especificar",
  franjaFecha: (franjaFecha as any) || "sin_especificar",
  ```
- **Flutter (Dart)**: ⚠️ Uso generalizado de `Map<String, dynamic>` en [api_cliente.dart](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/lib/core/api_cliente.dart), [auth_service.dart](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/lib/features/auth/auth_service.dart), [estado_sesion.dart](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/lib/features/auth/estado_sesion.dart) y todos los controladores. Faltan clases de modelo tipadas (`UsuarioModel`, `CitaModel`, `ServicioModel`) con serialización `fromJson`/`toJson`.

### 3.4 Código Muerto, Duplicados y Carpetas Repetidas
- 🔴 **Carpeta anidada repetida `ORBIA/`**:
  Existe el subdirectorio [C:\Users\carmi\OneDrive\Desktop\ANTIGRAVTY PROGRAMAS\ORBIA](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/ORBIA) que contiene copias obsoletas de `data/`, `src/`, `node_modules/`, `package.json` y `tsconfig.json`. Debe ser eliminada para evitar confusión en evaluadores.
- ⚠️ **Vistas Legacy no utilizadas**:
  La carpeta [src/views/](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/views/) contiene módulos SSR antiguos (`agendar_views.ts`, `auth_views.ts`, `catalogo_views.ts`, `layout.ts`) que quedaron inactivos tras migrar el frontend a Flutter.
- ⚠️ **Duplicados de Puente en `src/core/`**:
  Los archivos [src/core/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/core/acciones.ts), `disponibilidad.ts` y `parse.ts` solo re-exportan hacia `src/tools/`.

---

## 4. GIT, DOCUMENTACIÓN Y USO DE IA (15 pts) — Calificación: 13 / 15

### 4.1 Estado de Git y Remoto
- **Git Status**: Árbol de trabajo en rama `main`.
- **Git Remote**:
  ```text
  origin  https://github.com/Orbiadate/orbia.git (fetch)
  origin  https://github.com/Orbiadate/orbia.git (push)
  ```
  ⚠️ **Observación**: El repositorio está bajo la organización `Orbiadate`. Se debe verificar si el profesor o rúbrica exige que el repositorio pertenezca a una organización institucional específica de la universidad.
- **Historial de Commits**: Mensajes estructurados (`feat(front): ...`, `refactor: ...`, `chore: ...`).

### 4.2 Binarios y Archivos Sensibles en Historial
- **Estado**: 🟢 **CUMPLE AL 100%**.
- Verificado con `git log --all --full-history`: **Nunca** se han versionado archivos `.env`, `.env.local`, ejecutables `.exe`, `node_modules/`, `.dart_tool/` ni `build/`.
- El archivo `.gitignore` cubre estrictamente todas las exclusiones requeridas.

### 4.3 Evidencia Documental del Trabajo con IA
- **Estado**: 🟢 **SOBRESALIENTE**.
- [leyens/bitacora_de_estudio.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/leyens/bitacora_de_estudio.md) registra de manera continua 39 entradas detallando cada indicación del usuario, solución, código y conceptos teóricos.
- El directorio `.agents/` define formalmente la habilidad `bitacora-estudio`.

---

## 5. APROPIACIÓN Y PRUEBAS (20 pts) — Calificación: 10 / 20

### 5.1 Ejecución de Pruebas Automatizadas
- **Salida de `flutter test`**:
  ```text
  00:00 +0: loading test/widget_test.dart
  00:00 +0: Sin sesion, la app muestra la pantalla de Iniciar Sesion
  00:01 +1: All tests passed!
  ```
  Pasa exitosamente, pero solo evalúa 1 caso de uso en Flutter.
- **Backend**: 🔴 **No existe script `npm test`** en `package.json`. No hay framework de pruebas unitarias configurado (Jest, Vitest ni node:test).

### 5.2 Funciones Principales sin Pruebas Automatizadas
- 🔴 `reservarCita`, `cancelarCita`, `modificarCita`, `consultarCitas`, `generarRecordatorios` ([src/tools/acciones.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/tools/acciones.ts)).
- 🔴 `filtrarDisponibilidad`, `elegirMejorHorario` ([src/tools/disponibilidad.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/tools/disponibilidad.ts)).
- 🔴 `validarRegistro`, `validarLogin`, `normalizarCorreo` ([src/tools/auth.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/tools/auth.ts)).
- 🔴 `hashearPassword`, `compararPassword`, `generarTokenJwt`, `verificarTokenJwt` ([src/io/auth_jwt.ts](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/src/io/auth_jwt.ts)).
- 🔴 Casos de error en UI de Flutter (credenciales incorrectas, fallo de red, validaciones de contraseña corta).

### 5.3 Coincidencia de Documentación con Código Actual
- **Estado**: 🔴 **NO COINCIDE en README.md**.
  - `README.md` menciona Anthropic Claude 3 Haiku y `ANTHROPIC_API_KEY`; el código real usa Gemini (`GEMINI_API_KEY`).
  - `README.md` no explica la arquitectura de Flutter Web ni cómo levantar `localhost:8080`.
  - La documentación en `leyens/` ([EJECUCION.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/leyens/EJECUCION.md) y [FASES.md](file:///c:/Users/carmi/OneDrive/Desktop/ANTIGRAVTY%20PROGRAMAS/leyens/FASES.md)) sí está actualizada y sincronizada, pero la portada del proyecto está desactualizada.

---

## BONIFICACIÓN (+5 pts) — Puntaje Obtenido: +4 pts

| Elemento Bono | Evaluación | Puntos |
| :--- | :--- | :---: |
| **Suite automatizada** | Existe en Flutter (`flutter test`), pero ausente en Backend | +1.0 / 1.5 |
| **Docker** | No existe `Dockerfile` ni `docker-compose.yml` | 0.0 / 1.0 |
| **Modo demo sin conexión** | CUMPLE: Fallback a `parsearSolicitudLocal` con `modoLocal: true` cuando no hay red | +1.5 / 1.5 |
| **Integración multi-lenguaje** | CUMPLE: Arquitectura Flutter (Dart Web) + Node.js (TypeScript) por API REST | +1.5 / 1.0 |
| **TOTAL BONO** | | **+4.0 / +5.0** |

---

## Lista de Correcciones Priorizada por Puntos en Riesgo

A continuación se listan las acciones necesarias para alcanzar la calificación máxima (100 + 5 bono), ordenadas de mayor a menor impacto:

### 🚨 Prioridad 1: Suite de Pruebas Unitarias Automatizadas en Backend (-10 pts en riesgo)
1. Instalar y configurar `jest` o `vitest` (o usar el módulo nativo `node:test` de Node.js sin dependencias extra).
2. Agregar script `"test": "node --test"` o `"test": "jest"` en `package.json`.
3. Crear pruebas unitarias para:
   - `src/tools/acciones.ts` (reservar, cancelar, modificar, consultar con y sin filtro).
   - `src/tools/disponibilidad.ts` (filtrado por franja, selección de mejor horario, sin cupos).
   - `src/tools/auth.ts` (validaciones de registro y contraseñas).
   - Casos límite: fecha pasada, entrada vacía, texto sin sentido.

### 🚨 Prioridad 2: Actualización Crítica del `README.md` (-9 pts en riesgo)
1. Reemplazar toda mención de Anthropic Claude por Google Gemini (`GEMINI_API_KEY`).
2. Actualizar el diagrama Mermaid con el flujo actual (Flutter $\rightarrow$ Express API $\rightarrow$ Gemini $\rightarrow$ Pure Tools).
3. Documentar claramente los dos comandos de arranque:
   - Backend: `npm run dev` (escucha en `http://localhost:3000`).
   - Frontend: `flutter run -d chrome --web-port 8080` (abre en `http://localhost:8080`).

### ⚠️ Prioridad 3: Reglas de Negocio en Disponibilidad y Colisiones (-5 pts en riesgo)
1. **Validación de fechas pasadas**: En `filtrarDisponibilidad`, descartar cualquier slot cuya fecha sea anterior a la fecha de hoy.
2. **Prevención de doble reserva**: En `reservarCita`, verificar si ya existe una cita confirmada para el mismo `negocioId`, `fecha` y `hora`, devolviendo error o rechazando la reserva duplicada.
3. **Pureza en `reservarCita`**: Eliminar `new Date().toISOString()` dentro de `src/tools/acciones.ts` y recibir la fecha de creación como parámetro opcional determinista.

### ⚠️ Prioridad 4: Limpieza de Código Muerto y Carpeta Duplicada (-4 pts en riesgo)
1. **Eliminar la subcarpeta obsoleta `ORBIA/`** de la raíz del proyecto.
2. **Archivar o eliminar las vistas legacy** en `src/views/` que quedaron en desuso tras la adopción de Flutter.
3. Reemplazar los casts `as any` en `tools.routes.ts` por validaciones de tipo seguras con uniones literales.
4. Definir modelos fuertemente tipados en Flutter en lugar de `Map<String, dynamic>`.

### ℹ️ Prioridad 5: Bonos Opcionales Faltantes (+1 pt en riesgo)
1. Crear un `Dockerfile` y `docker-compose.yml` para levantar la API de Node.js y compilar Flutter Web en un contenedor listo para despliegue.
