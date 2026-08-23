// compaction.test.js

import { settings } from "../src/config/setting.js";
import { compaction, compactionCheck } from "../src/agents/compaction.js";
import { sessionStore } from "../src/session/session-store.js";
import { EVENT } from "../src/agents/event-type.js";

// llm
const [provider, model] = (await settings.get("model")).split("/");

// session
const listSession = sessionStore.listSessions();
const session_id = "e4c779b9-acc4-4de8-ae51-55ff458c2b3d";
let token = 3000;

// compaction check
if (compactionCheck({ model, token })) {
  let result = compaction({
    session_id,
    provider,
    model,
  });

  for await (const event of result) {
    if (event.role === EVENT.ASSISTANT) {
      console.log(event.content.text);
    }

    if (event.role === EVENT.ERROR) {
      console.log(event.content.messages);
    }
  }
}
