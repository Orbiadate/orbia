import "dotenv/config";
import dotenv from "dotenv";
import path from "path";

// Asegura que .env se cargue desde la raíz del proyecto (junto a package.json)
dotenv.config({ path: path.resolve(__dirname, ".env") });

import { iniciarServidor } from "./src/io/server";

// Iniciar el servidor web SSR de ORBIA (Imperative Shell)
const PUERTO = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
iniciarServidor(PUERTO);