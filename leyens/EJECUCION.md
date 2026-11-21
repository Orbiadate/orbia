# Guía de Ejecución y Puertos — ORBIA

Este documento detalla la separación estricta entre el servidor backend (API en TypeScript / Express) y el cliente frontend (Flutter Web).

---

## 1. Arquitectura de Desacoplamiento

ORBIA opera con dos procesos independientes en desarrollo:
1. **Backend API (TypeScript / Express)**: Escucha en `http://localhost:3000` y expone endpoints JSON con cabeceras CORS activadas.
2. **Frontend Cliente (Flutter / Dart Web)**: Corre en un servidor local fijo en `http://localhost:8080` (en Chrome), comunicándose con el backend a través de `ApiCliente` (`http://localhost:3000/api`).

---

## 2. Cómo Levantar el Backend (Puerto 3000)

- **Comando de inicio**:
  ```bash
  npm run dev
  # Alternativa directa:
  npx ts-node index.ts
  ```
- **Compilación estática (validación TypeScript)**:
  ```bash
  npm run build
  ```
- **Rutas Principales Expuestas**:
  - `GET /`: Verificación rápida del servicio (`{"servicio":"ORBIA API","estado":"ok"}`)
  - `GET /api/health`: Health check general del sistema
  - `/api/tools/`:
    - `POST /api/tools/parse`: Extracción estructurada con Gemini LLM
    - `GET /api/tools/disponibilidad`: Cálculo funcional de disponibilidad
    - `POST /api/tools/acciones`: Reservar, cancelar, modificar o consultar citas
  - `/api/auth/`: Registro, login, logout y sesión activa (`/api/auth/yo`)
  - `/api/citas/`: Listado y mutaciones de citas
  - `/api/`: Catálogo de lugares (`/api/lugares`), locales (`/api/locales`) y servicios (`/api/servicios`)

---

## 3. Cómo Levantar el Frontend (Puerto 8080)

- **Comando de inicio con puerto fijo**:
  ```bash
  flutter run -d chrome --web-port 8080
  ```
- **Verificación estática y tests unitarios**:
  ```bash
  flutter analyze
  flutter test
  ```
- **Navegación**:
  - Al abrir `http://localhost:8080`, la aplicación renderiza el shell interactivo con tema oscuro oficial (`temas.dart`) y las 3 pestañas principales: **Servicios**, **Citas** y **Cuenta**.

---

## 4. Verificación Rápida de Conexión

Desde la terminal integrada de PowerShell:
```powershell
# Probar backend
(Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing).Content
# Salida esperada: {"servicio":"ORBIA API","estado":"ok"}

# Probar front
(Invoke-WebRequest -Uri "http://localhost:8080/" -UseBasicParsing).StatusCode
# Salida esperada: 200
```

