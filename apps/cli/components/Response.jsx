import React from "react";
import { Box, Text } from "ink";
import MarkdownRenderer from "./markdown/Markdown.jsx";
import { useColumns } from "../hooks/useColumns.js";

const Response = ({ response, type }) => {
  const columns = useColumns();
  const markdownWidth = Math.max(columns - 6, 10);

  const icon = {
    assistant: "🤖",
    compaction: "🗜️",
  };

  const bgColor = type === "compaction" ? "#202020" : "";

  return (
    <Box
      flexDirection="row"
      flexWrap="nowrap"
      gap={1}
      marginTop={1}
      marginLeft={1}
    >
      <Box flexShrink={0}>
        <Text>{icon[type]}</Text>
      </Box>
      <Box width={markdownWidth} backgroundColor={bgColor}>
        <MarkdownRenderer content={response} width={markdownWidth} />
      </Box>
    </Box>
  );
};

export default Response;
