import React from "react";
import { Box, Text, useStdout } from "ink";

function formatToolArgs(argumentsString) {
  try {
    const args = JSON.parse(argumentsString);

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
  } catch {
    return argumentsString ?? "";
  }
}

const ToolCall = ({ toolCall }) => {
  const { stdout } = useStdout();
  const columns = stdout.columns;

  const widthBorder = columns < 100 ? columns - 4 : Math.floor(columns * 0.6);

  const arg = formatToolArgs(toolCall.arguments);

  return (
    <Box
      flexDirection="row"
      borderStyle="round"
      borderColor="#212121"
      width={widthBorder}
      paddingX={1}
      gap={1}
    >
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
