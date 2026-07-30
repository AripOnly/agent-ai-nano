// Thinking.jsx

import React from "react";
import { Text, Box } from "ink";
import Spinner from "ink-spinner";

const Thinking = () => {
  return (
    <Text>
      <Text color="green">
        <Spinner type="dots" />
      </Text>
      {" Thinking..."}
    </Text>
  );
};

export default Thinking;
