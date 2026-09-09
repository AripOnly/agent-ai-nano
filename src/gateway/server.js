// src/gateway/server.js

import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat-route.js";
import sessionRouter from "./routes/session-route.js";
import configRouter from "./routes/config-route.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/session", sessionRouter);
app.use("/api/v1/config", configRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
