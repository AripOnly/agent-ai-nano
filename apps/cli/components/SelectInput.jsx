// SelectInput.jsx

import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";

const SelectInput = ({ items = [], onSelect, onCancel, isFocused = true }) => {
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    if (cursor > items.length - 1) {
      setCursor(Math.max(0, items.length - 1));
    }
  }, [items.length]);

  useInput(
    (input, key) => {
      if (!isFocused) return;

      if (key.upArrow || input === "k") {
        setCursor((prev) => (prev - 1 + items.length) % items.length);
        return;
      }

      if (key.downArrow || input === "j") {
        setCursor((prev) => (prev + 1) % items.length);
        return;
      }

      if (items[cursor] !== undefined) {
        if (key.return) {
          onSelect?.(items[cursor]);
          return;
        }
      }

      if (key.escape) {
        onCancel?.();
      }
    },
    { isActive: isFocused },
  );

  return (
    <Box flexDirection="column">
      {items.map((item, index) => (
        <Text key={item.value ?? index}>
          {index === cursor ? (
            <Text color="green">{"▸ "}</Text>
          ) : (
            <Text color="gray">{"  "}</Text>
          )}
          {item.label}
        </Text>
      ))}
    </Box>
  );
};

export default SelectInput;
