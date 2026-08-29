import { agent } from "../src/agents/agent.js";
import { sessionStore } from "../src/session/session-store.js";

const prompt = "hello nano";
const session = sessionStore.listSessions();
const session_id = session[0]?.id;
const name = "nano";

for await (let event of agent({ name, prompt, session_id })) {
  console.log(event);
}
