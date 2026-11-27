# Fases de ORBIA

## Backend (TypeScript / Express)
- **Fase 1**: Núcleo puro (acciones, disponibilidad, parse determinista). [Completada]
- **Fase 2**: Prototipo funcional con cita confirmada. [Completada]
- **Fase 3**: Integración LLM real con Gemini (resiliencia, backoff y fallback). [Completada]
- **Fase 4**: Reestructura arquitectónica (leyens/, tools/, máx. 200 líneas). [Completada]
- **Fase 5**: Capa de API HTTP/JSON modular con CORS para Flutter. [Completada]

## Frontend (Flutter / Dart Web)
- **Fase 1 (Front)**: Inicialización del proyecto Flutter Web con arquitectura Feature-First (auth, servicios, local, lugar, citas). [Completada]
- **Fase 2 (Front)**: Tema centralizado (`temas.dart`), enrutador declarativo (`go_router`), shell con barra de navegación inferior persistente (Servicios, Citas, Cuenta) y pantallas placeholder por dominio. [Completada]
- **Fase 3 (Front)**: Autenticación y Cuentas (Login, Registro con validación, Perfil con cerrar sesión, JWT y bcrypt). [Completada]
- **Fase 4 (Front)**: Servicios, Lugares y Locales (Catálogo interactivo, plano de Plaza Central). [Pendiente]
- **Fase 5 (Front)**: Agendamiento de citas (Selector manual y Asistente en lenguaje natural con IA). [Pendiente]
- **Fase 6 (Front)**: Pulido visual, responsive y entrega final. [Pendiente]
