import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

import chatRoutes from "./routes/chat.routes.js";
import healthRoutes from "./routes/health.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// ✅ Strong CORS config for Swagger + browser requests
const corsOptions = {
  origin: "*", // allow all (for testing; later restrict to your frontend domain)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization"
  ]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Doctor Chat API is running!");
});

// ✅ Swagger docs (fix path for Railway deployment)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerDoc = YAML.load(path.join(__dirname, "./docs/swagger.yaml"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// ✅ Routes
app.use("/chat", chatRoutes);
app.use("/health", healthRoutes);

// ✅ Error handler
app.use(errorHandler);

export default app;
