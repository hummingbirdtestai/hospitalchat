import app from "./app.js";
import { config } from "./config/env.js";

// ✅ Start server
app.listen(config.port, () => {
  console.log(`🚀 API running on port ${config.port}`);
});
