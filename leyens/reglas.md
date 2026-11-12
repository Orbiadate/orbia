# Reglas de Arquitectura y Desarrollo de ORBIA

Este documento compila las directrices oficiales que rigen el desarrollo del proyecto ORBIA.

## 1. Límite Estricto de 200 Líneas por Archivo
- **Ningún archivo de código fuente** (Dart, TypeScript, etc.) puede exceder las **200 líneas**.
- Si un módulo o componente crece más allá de este límite, debe particionarse por responsabilidades claras (controladores, sub-rutas, widgets auxiliares, utilerías).

## 2. Arquitectura de Front: Feature-First en Flutter
- El frontend está desarrollado en **Flutter (Dart)**.
- La organización es por **dominios de negocio (feature-first)**:
  - `auth`
  - `servicios`
  - `local`
  - `lugar`
  - `citas`
- Cada dominio encapsula sus propias pantallas, widgets y lógica de estado/servicios.

## 3. Arquitectura de Backend: Núcleo Puro / Shell Impuro
- El backend está construido en **TypeScript (Node.js/Express)**.
- **Núcleo Puro (`src/tools/`, `src/core/`)**: funciones matemáticas/deterministas sin efectos colaterales, sin I/O, sin lecturas de base de datos ni llamadas de red.
- **Shell Impuro (`src/io/`)**: gestión de peticiones HTTP, llamadas al LLM, acceso a base de datos SQLite, cookies y sesiones.

## 4. Centralización de Estilos en `temas.dart`
- Todos los estilos (colores, tipografías, dimensiones, temas claro/oscuro) se declaran exclusivamente en `lib/core/temas.dart`.
- Las pantallas no definen colores ni tipografías inline; leen las propiedades globales desde el `ThemeData`.

## 5. Entrada Única y Rutas Limpias
- El punto de entrada del cliente es `lib/main.dart`, responsable únicamente de inicializar la app, configurar el tema y registrar las rutas por dominios. Cero lógica de presentación de pantallas en él.

