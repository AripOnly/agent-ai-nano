// src/gateway/routes/session-route.js

import { Router } from "express";
import { sessions } from "../controllers/session-controller.js";

const router = Router();

router.get("/", sessions.getSession);

export default router;
