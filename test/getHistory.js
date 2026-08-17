import { conversation } from "../src/session/conversation.js";
const fullHistory = JSON.stringify(conversation.getHistory(), null, 2);
console.log(fullHistory);
