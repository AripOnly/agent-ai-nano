// App.js

import React, { useEffect, useState } from "react";
import { Text, Box, useWindowSize, useApp, Newline, Static } from "ink";
import Gradient from "ink-gradient";
import BigText from "ink-big-text";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";

import { agent } from "../../src/agents/agent.js";
import Thinking from "./components/Thinking.jsx";
import BoxChat from "./components/BoxChat.jsx";
import { conversation } from "../../src/session/conversation.js";

export default function App() {
  const { columns } = useWindowSize();
  const { exit } = useApp();

  const [input, setInput] = useState("");
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [setting, setSwtting] = useState();

  useEffect(() => {
    if (!userInput) return;

    setChat((prev) => [
      ...prev,
      { role: "user", content: { text: userInput } },
    ]);
    setThinking(true);

    async function stream() {
      for await (const event of agent({ name: "nano", prompt: userInput })) {
        if (event.role === "assistant") {
          setThinking(false);
          setChat((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];

            if (last?.role === "assistant") {
              last.content += event.content.text;
            } else {
              next.push({
                role: "assistant",
                content: event.content.text,
              });
            }

            return next;
          });
        }

        if (event.role === "reasoning_summary") {
          setThinking(true);
        } else {
          setThinking(false);
        }

        if (event.role === "tool_call" || event.role === "error") {
          setThinking(false);
          setChat((prev) => [...prev, event]);
        }
      }
    }

    stream();
  }, [userInput]);

  return (
    <Box flexDirection="column" width={columns}>
      <Box marginBottom={1} justifyContent="center">
        <Box width={columns - 2}>
          <Gradient name="rainbow">
            <BigText text="NANO" />
          </Gradient>
        </Box>
      </Box>

      <Box marginTop={1} justifyContent="center">
        <Box width={columns - 2} flexDirection="column" flexWrap="nowrap">
          <BoxChat chat={chat} />
        </Box>
      </Box>

      <Box marginTop={1} justifyContent="center">
        <Box width={columns - 2}>{thinking && <Thinking />}</Box>
      </Box>

      <Box marginTop={1} justifyContent="center">
        <Box width={columns - 2} borderStyle={"round"} borderColor={"#363737"}>
          <Text>{"👤 "}</Text>
          <TextInput
            value={input}
            onChange={setInput}
            onSubmit={(value) => {
              if (value === "exit") {
                exit();
                return;
              }

              setUserInput(value);
              setInput("");
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
