import express from "express";
import helmet from "helmet";
import cors from "cors";

import userRouter from "./routes/user.routes.js";
import { notFound } from "./middlewares/not-found.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(cors());

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/v1/users", userRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
