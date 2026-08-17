// PromptInput.jsx

import React, { useState } from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";

const PromptInput = ({ onSend, onExit }) => {
  const [input, setInput] = useState("");

  return (
    <Box marginTop={1} justifyContent="center">
      <Box width={"100%"} borderStyle={"round"} borderColor={"#363737"}>
        <Text>{"👤 "}</Text>
        <TextInput
          value={input}
          onChange={setInput}
          onSubmit={(value) => {
            if (value === "exit") {
              onExit();
              return;
            }

            onSend(value);
            setInput("");
          }}
        />
      </Box>
    </Box>
  );
};

export default PromptInput;
