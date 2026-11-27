import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { toolsRouter } from "./routes/tools.routes";
import { authRouter } from "./routes/auth.routes";
import { catalogoRouter } from "./routes/catalogo.routes";
import { citasRouter } from "./routes/citas.routes";

export const app = express();

// Middlewares estándar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cabeceras CORS para permitir comunicación con Flutter Web y clientes móviles
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Archivos estáticos legacy
app.use(express.static(path.join(__dirname, "../../public")));

// Capa de API HTTP / JSON
app.use("/auth", authRouter);
app.use("/api/auth", authRouter);
app.use("/api/tools", toolsRouter);
app.use("/api/citas", citasRouter);
app.use("/api", catalogoRouter);

// Ruta raíz de verificación de API
app.get("/", (_req: Request, res: Response) => {
  res.json({ servicio: "ORBIA API", estado: "ok" });
});

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, version: "2.0.0", backend: "TypeScript / Node.js", front: "Flutter (Dart)" });
});

export function iniciarServidor(puerto: number = 3000): Promise<void> {
  return new Promise((resolve) => {
    app.listen(puerto, () => {
      console.log(`[ORBIA API Backend] Ejecutándose en http://localhost:${puerto}`);
      resolve();
    });
  });
}

if (require.main === module) {
  const puerto = parseInt(process.env.PORT || "3000", 10);
  iniciarServidor(puerto);
}
