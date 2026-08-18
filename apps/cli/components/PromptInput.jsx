// PromptInput.jsx

import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import CommandBox from "./CommandBox.jsx";
import SessionList from "./SessionList.jsx";
import SelectInput from "./SelectInput.jsx";

const SESSION_ACTIONS = [
  { value: "select", label: "select" },
  { value: "rename", label: "rename" },
  { value: "delete", label: "delete" },
];

const PromptInput = ({
  onSend,
  onExit,
  onNew,
  onSwitchSession,
  onDeleteSession,
  onRenameSession,
  sessions = [],
}) => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("text"); // "text" | "command" | "session" | "sessionActions" | "sessionRename"
  const [selectedSession, setSelectedSession] = useState(null);
  const [renameInput, setRenameInput] = useState("");

  const reset = () => {
    setInput("");
    setSelectedSession(null);
    setRenameInput("");
    setMode("text");
  };

  useInput(
    (input, key) => {
      if (key.escape && mode === "sessionRename") {
        setSelectedSession(null);
        setRenameInput("");
        setMode("session");
      }
    },
    { isActive: mode === "sessionRename" },
  );

  const handleChange = (value) => {
    setInput(value);

    if (value.startsWith("/")) {
      setMode("command");
    } else if (mode === "command") {
      setMode("text");
    }
  };

  const handleSubmit = (value) => {
    if (mode !== "text") return;

    if (value === "exit") {
      onExit();
      return;
    }

    onSend(value);
    reset();
  };

  const handleCommand = (item) => {
    if (item.value === "new") {
      onNew();
      reset();
      return;
    }

    if (item.value === "session") {
      setMode("session");
    }
  };

  const cancel = () => {
    setInput("");
    setMode("text");
  };

  const handleSelectSession = (item) => {
    const session = sessions.find((s) => s.id === item.value);
    if (!session) return;
    setSelectedSession(session);
    setMode("sessionActions");
  };

  const handleAction = (item) => {
    if (!selectedSession) return;

    if (item.value === "select") {
      onSwitchSession(selectedSession.id);
      reset();
      return;
    }

    if (item.value === "rename") {
      setRenameInput(selectedSession.name ?? "");
      setMode("sessionRename");
      return;
    }

    if (item.value === "delete") {
      onDeleteSession(selectedSession.id);
      reset();
    }
  };

  const handleRename = (value) => {
    if (selectedSession) {
      onRenameSession(selectedSession.id, value);
    }
    setSelectedSession(null);
    setRenameInput("");
    setMode("session");
  };

  return (
    // <Box flexDirection="column" borderStyle={"round"} borderColor={"#363737"}>
    <Box
      flexDirection="column"
      backgroundColor={"#212121"}
      padding={1}
      marginTop={2}
    >
      <Box justifyContent="center">
        <Box width={"100%"}>
          <Text>{"👤 "}</Text>
          <TextInput
            value={input}
            onChange={handleChange}
            onSubmit={handleSubmit}
            focus={mode === "text" || mode === "command"}
          />
        </Box>
      </Box>

      {mode === "command" && (
        <Box justifyContent="center" marginTop={1} paddingX={1}>
          <Box width={"100%"}>
            <CommandBox
              filter={input.slice(1)}
              onSelect={handleCommand}
              onCancel={cancel}
            />
          </Box>
        </Box>
      )}

      {mode === "session" && (
        <Box justifyContent="center" marginTop={1} paddingX={1}>
          <Box width={"100%"}>
            <SessionList
              sessions={sessions}
              onSelect={handleSelectSession}
              onCancel={cancel}
            />
          </Box>
        </Box>
      )}

      {mode === "sessionActions" && selectedSession && (
        <Box justifyContent="center" marginTop={1} paddingX={1}>
          <Box width={"100%"} flexDirection="column">
            <Text color="gray">Session: {selectedSession.name}</Text>
            <SelectInput
              items={SESSION_ACTIONS}
              onSelect={handleAction}
              onCancel={() => setMode("session")}
            />
          </Box>
        </Box>
      )}

      {mode === "sessionRename" && selectedSession && (
        <Box justifyContent="center" marginTop={1} paddingX={1}>
          <Box width={"100%"} flexDirection="column">
            <Text color="gray">Rename session:</Text>
            <Box flexDirection="row">
              <Text>{"> "}</Text>
              <TextInput
                value={renameInput}
                onChange={setRenameInput}
                onSubmit={handleRename}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PromptInput;