import React from "react";
import { Box, Text, useStdout } from "ink";

function formatToolArgs(argumentsValue) {
  let args = argumentsValue;

  if (typeof args === "string") {
    try {
      args = JSON.parse(args);
    } catch {
      return args;
    }
  }

  if (args && typeof args === "object") {
    return Object.entries(args)
      .map(([key, value]) => {
        let text = String(value);

        text = text.replace(/\n/g, "\\n");

        if (text.length > 40) {
          text = text.slice(0, 40) + "...";
        }

        return `${key}=${text}`;
      })
      .join(" ");
  }

  return String(args ?? "");
}

const ToolCall = ({ toolCall }) => {
  const { stdout } = useStdout();
  const columns = stdout.columns;

  const arg = formatToolArgs(toolCall.arguments);

  return (
    <Box flexDirection="row" paddingX={1} gap={1} marginTop={1}>
      <Box>
        <Text>🔧</Text>
      </Box>
      <Box>
        <Text color="#F6850C">{toolCall.name}: </Text>
        <Text color="#898989" wrap="truncate">
          {arg}
        </Text>
      </Box>
    </Box>
  );
};

export default ToolCall;
