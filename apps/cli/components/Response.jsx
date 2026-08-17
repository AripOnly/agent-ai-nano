import React, { useEffect } from "react";
import { Box, Text } from "ink";
import MarkdownRenderer from "./markdown/Markdown.jsx";

const Response = ({ response }) => {
  return (
    <Box flexDirection="row" gap={1} marginTop={1} marginLeft={1}>
      <Box>
        <Text>🤖</Text>
      </Box>
      <Box>
        <MarkdownRenderer content={response} />
      </Box>
    </Box>
  );
};

export default Response;
