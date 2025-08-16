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

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Doctor Chat API is running!");
});

// ✅ Fix Swagger path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerDoc = YAML.load(path.join(__dirname, "./docs/swagger.yaml"));

// Serve raw JSON spec
app.get("/docs.json", (req, res) => {
  res.json(swaggerDoc);
});

// Serve Swagger UI and point it to /docs.json
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Routes
app.use("/chat", chatRoutes);
app.use("/health", healthRoutes);

// Error handler
app.use(errorHandler);

export default app;
