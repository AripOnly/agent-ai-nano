import { toStr } from "../src/utils/tostr.js";

const a = [
  {
    signature: null,
    call_id: "call_791533",
    name: "Read",
    arguments: { path: "package.json" },
  },
  {
    signature: null,
    call_id: "call_791541",
    name: "Run",
    arguments: { path: "startdate.md" },
  },
];

const result = await Promise.all(a.map((c) => c));

console.log(result.map(toStr));

// console.log(result);

// for (let i = 0; i < result.length; i++) {
//   console.log("name: " + result[i].name);
//   console.log("arg: " + JSON.stringify(result[i].arguments, null, 2));
//   console.log("");
// }
