// src/gateway/controllers/session-controller.js

import { sessionStore } from "../../session/session-store.js";

function getSession(req, res, next) {
  try {
    res.status(200).send(sessionStore.listSessions());
  } catch (error) {
    res.status(500).send.json({
      error: "Internal Server Error",
    });
  }
}

export const sessions = {
  getSession,
};
