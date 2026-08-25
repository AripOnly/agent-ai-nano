// compaction.test.js

import { sessionStore } from "../src/session/session-store.js";
import { settings } from "../src/config/setting.js";
import { compaction } from "../src/agents/compaction.js";

// setting
const { provider, model } = await settings.get("model");

// session
const listSession = sessionStore.listSessions();
const session_id = "f0477042-188a-4b20-aa94-92235413bf92";

let history = sessionStore.getHistory(session_id);
let prune = sessionStore.pruneHistory(history);

history = sessionStore.getHistory(session_id);

for await (let event of compaction({
  history,
  provider,
  model,
  session_id,
})) {
  console.log(event);
}
