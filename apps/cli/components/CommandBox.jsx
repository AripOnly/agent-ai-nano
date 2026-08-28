// CommandBox.jsx

import React from "react";
import { Box, Text } from "ink";
import SelectInput from "./SelectInput.jsx";

const COMMANDS = [
  { value: "session", label: "/session" },
  { value: "new", label: "/new" },
  { value: "provider", label: "/provider" },
  { value: "model", label: "/model" },
];

const CommandBox = ({ filter = "", onSelect, onCancel }) => {
  const items = COMMANDS.filter((cmd) =>
    cmd.value.startsWith(filter.toLowerCase()),
  );

  return (
    <Box width={"100%"} flexDirection="column">
      <Text color="gray">Commands</Text>
      <SelectInput items={items} onSelect={onSelect} onCancel={onCancel} />
    </Box>
  );
};

export default CommandBox;
