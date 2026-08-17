// App.jsx

import React, { useEffect, useState } from "react";
import { Box, useApp, Static, Text } from "ink";

import { useChat } from "./hooks/useChat.js";
import { useColumns } from "./hooks/useColumns.js";
import Header from "./components/Header.jsx";
import PromptInput from "./components/PromptInput.jsx";
import Spinner from "./components/Spinner.jsx";
import BoxChat from "./components/BoxChat.jsx";
import Thinking from "./components/Thinking.jsx";
import { tokenUsage } from "../../src/usage/token-usage.js";
import { settings } from "../../src/config/setting.js";

export default function App() {
  const columns = useColumns();
  const { exit } = useApp();
  const { chat, history, thinking, loading, send } = useChat();
  const [token, setToken] = useState(0);

  const header = <Header key="nano-header" columns={columns} />;

  const historyItems = history.map((item, i) => (
    <BoxChat key={`h-${i}`} chat={[item]} />
  ));

  const boxLoading = (
    <Text>
      <Text color="green">
        <Spinner type="dotsCircle" />
      </Text>
      {" Loading..."}
    </Text>
  );

  useEffect(() => {
    async function getTokens() {
      const tokens = await tokenUsage.get();
      setToken(tokens.total_tokens);
    }

    getTokens();
  }, [history]);

  return (
    <>
      <Static
        items={[header, ...historyItems]}
        style={{ width: columns, paddingLeft: 1, paddingRight: 1 }}
      >
        {(el) => el}
      </Static>

      <Box flexDirection="column" width={columns} paddingX={1}>
        <Box width={"100%"} flexDirection="column" flexWrap="nowrap">
          <BoxChat chat={chat} />
        </Box>

        <Box marginTop={1} justifyContent="center" paddingX={2}>
          <Box width={"100%"}>{thinking && <Thinking />}</Box>
        </Box>

        <PromptInput onSend={send} onExit={exit} />

        <Box
          marginBottom={2}
          paddingX={2}
          flexDirection="row"
          flexWrap="nowrap"
          justifyContent="space-between"
        >
          <Box>{loading ? boxLoading : ""}</Box>
          <Box flexDirection="row" flexWrap="nowrap" gap={2}>
            <Text>Token: {token}</Text>
            <Text>|</Text>
            <Text>agent: Nano</Text>
            <Text>|</Text>
            <Text>model: gemini/gemini-3.1-flash-lite</Text>
          </Box>
        </Box>
      </Box>
    </>
  );
}
