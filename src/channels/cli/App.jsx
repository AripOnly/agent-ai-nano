// App.js

import React, { useEffect, useState } from "react";
import { Text, Box, useWindowSize, useApp, Newline } from "ink";
import Gradient from "ink-gradient";
import BigText from "ink-big-text";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";

import { AgentReAct } from "../../agents/agent-react.js";
import Chat from "./components/Chat.jsx";
import Thinking from "./components/Thinking.jsx";

export default function App() {
  const { columns } = useWindowSize();
  const { exit } = useApp();

  const [input, setInput] = useState("");
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [config, setConfig] = useState();

  useEffect(() => {
    if (!userInput) return;

    setChat((prev) => [...prev, { role: "user", content: userInput }]);
    setThinking(true);

    async function stream() {
      for await (const event of AgentReAct(userInput)) {
        // console.log(event, null, 2);
        // continue;
        if (event.type === "model_output" || event.type === "error") {
          setThinking(false);
          setChat((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];

            if (last?.role === "model_output") {
              last.content += event.data.text;
            } else {
              next.push({
                role: "model_output",
                content: event.data.text,
              });
            }

            return next;
          });
        }

        if (event.type === "thought") {
          setThinking(true);
        } else {
          setThinking(false);
        }

        if (event.type === "function_call") {
          setThinking(false);
          setChat((prev) => [
            ...prev,
            { role: "function_call", content: event.data },
          ]);
        }
      }
    }

    stream();
  }, [userInput]);

  return (
    <Box flexDirection="column" width={columns - 2}>
      <Box marginBottom={1} justifyContent="center">
        <Gradient name="rainbow">
          <BigText text="# Nano #" />
        </Gradient>
      </Box>

      <Box flexDirection="column" flexWrap="nowrap">
        <Chat chat={chat}></Chat>
        <Newline></Newline>
        <Thinking>{thinking}</Thinking>
      </Box>

      <Box borderStyle={"round"} borderColor={"#363737"} marginTop={1}>
        <Text>{"> "}</Text>
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
  );
}
