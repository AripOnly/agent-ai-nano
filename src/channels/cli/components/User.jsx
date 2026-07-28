// user.jsx

import React from "react";
import { Text, Box, Newline } from "ink";

const User = ({ children }) => {
  return (
    <Box
      flexDirection="column"
      backgroundColor={"#212121"}
      padding={1}
      marginTop={1}
    >
      <Text>{children}</Text>
    </Box>
  );
};

export default User;
