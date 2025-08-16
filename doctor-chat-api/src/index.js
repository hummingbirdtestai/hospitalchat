import express from "express";
import chatRoutes from "./routes/chat.routes.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(express.json());

// routes
app.use("/", healthRoutes);
app.use("/", chatRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
