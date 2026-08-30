// user.jsx

import React from "react";
import { Text, Box } from "ink";

const User = ({ children }) => {
  const text =
    typeof children === "object" && children !== null
      ? children.text
      : children;

  return (
    <Box
      flexDirection="row"
      flexWrap="nowrap"
      width="100%"
      padding={1}
      gap={1}
      marginTop={1}
      backgroundColor={"#212121"}
      alignItems="flex-start"
    >
      <Box flexShrink={0}>
        <Text>👤</Text>
      </Box>
      <Box flexGrow={1}>
        <Text wrap="wrap">{text}</Text>
      </Box>
    </Box>
  );
};

export default User;
