import React, { useEffect } from "react";
import { Box } from "ink";
import MarkdownRenderer from "./markdown/MarkdownRenderer.jsx";

const Response = ({ response }) => {
  return (
    <Box flexDirection="column" marginTop={1}>
      <MarkdownRenderer>{response}</MarkdownRenderer>
    </Box>
  );
};

export default Response;
