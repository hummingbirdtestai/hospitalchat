import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import chatRoutes from "./routes/chat.routes.js";
import healthRoutes from "./routes/health.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: "*", // ⚠️ open for now, restrict later
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Doctor Chat API is running!");
});

// ✅ Swagger docs
const swaggerDoc = YAML.load("./src/docs/swagger.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// ✅ Routes
app.use("/chat", chatRoutes);
app.use("/health", healthRoutes);

// ✅ Error handler
app.use(errorHandler);

export default app;
