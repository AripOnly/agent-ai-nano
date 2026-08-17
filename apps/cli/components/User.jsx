// user.jsx

import React from "react";
import { Text, Box, Newline } from "ink";

const User = ({ children }) => {
  const text =
    typeof children === "object" && children !== null
      ? children.text
      : children;

  return (
    <Box
      padding={1}
      backgroundColor={"#212121"}
      marginTop={1}
      flexDirection="row"
      gap={1}
      alignItems="center"
    >
      <Box>
        <Text>👤</Text>
      </Box>
      <Box>
        <Text>{text}</Text>
      </Box>
    </Box>
  );
};

export default User;
