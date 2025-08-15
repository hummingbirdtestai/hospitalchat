import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { config } from "./config/env.js";
import chatRoutes from "./routes/chat.routes.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();

// ✅ CORS fix: allow Swagger UI & any browser to call the API
app.use(cors({
  origin: "*", // allow all origins for now (restrict later)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Swagger docs
const swaggerDoc = YAML.load("./src/docs/swagger.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Routes
app.use("/chat", chatRoutes);
app.use("/health", healthRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Server error" });
});

// Start server
app.listen(config.port, () => {
  console.log(`🚀 API running on port ${config.port}`);
});
