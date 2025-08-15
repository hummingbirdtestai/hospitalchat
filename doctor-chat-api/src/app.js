import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { config } from "./config/env.js";
import chatRoutes from "./routes/chat.routes.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

const swaggerDoc = YAML.load("./src/docs/swagger.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use("/chat", chatRoutes);
app.use("/health", healthRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Server error" });
});

app.listen(config.port, () => {
  console.log(`🚀 API running on port ${config.port}`);
});
