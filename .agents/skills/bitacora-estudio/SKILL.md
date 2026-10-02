---
name: bitacora-estudio
description: >-
  Utiliza esta habilidad para registrar y mantener actualizada la bitácora de estudio
  (bitacora_de_estudio.md) en cada interacción, documentando la indicación recibida (prompt),
  la respuesta de cómo se atendió y el timestamp correspondiente.
---

# Habilidad: Bitácora de Estudio

Esta habilidad establece el flujo de trabajo para registrar de forma continua y ordenada cada indicación (`prompt`), la solución implementada y el material didáctico o técnico en el archivo `bitacora_de_estudio.md`.

## Cuándo Activar
- **Obligatorio en cada turno/indicación** del usuario en este espacio de trabajo.
- Al generar explicaciones, código, análisis o material de aprendizaje.

## Formato Estándar de Entrada

Cada interacción debe agregarse de manera incremental en `bitacora_de_estudio.md` respetando la siguiente plantilla:

```markdown
---

### Entrada #[N] — [Título breve o tema de la indicación]
- **Timestamp**: `AAAA-MM-DDTHH:mm:ss-06:00`
- **Indicación (Prompt)**:
  > "[Texto o indicación enviada por el usuario]"
- **Cómo se atendió la petición**:
  [Descripción clara y estructurada de las acciones tomadas, herramientas usadas y solución proporcionada]
- **Material de Estudio y Conceptos Clave**:
  - **Archivos involucrados**: [Enlaces clicables a archivos creados o editados]
  - **Conceptos clave**: [Temas técnicos, buenas prácticas o notas relevantes]
```

## Reglas de Operación
1. **Preservación de Historial**: Nunca borrar ni sobreescribir entradas previas; agregar siempre al final.
2. **Fidelidad del Prompt**: Registrar la intención original del usuario.
3. **Claridad en la Respuesta**: Detallar de manera transparente cómo se resolvió la consulta.
4. **Timestamp**: Registrar la fecha y hora del sistema local en cada turno.
