// SessionList.jsx

import React from "react";
import { Box, Text } from "ink";
import SelectInput from "./SelectInput.jsx";

const SessionList = ({ sessions = [], onSelect, onCancel }) => {
  let items;

  if (sessions.length !== 0) {
    items = sessions.map((session) => ({
      value: session.id,
      label: session.name,
    }));
  } else {
    items = [
      {
        value: null,
        label: "no session",
      },
    ];
  }

  return (
    <Box width={"100%"} flexDirection="column">
      <Text color="gray">Sessions</Text>
      <SelectInput items={items} onSelect={onSelect} onCancel={onCancel} />
    </Box>
  );
};

export default SessionList;
