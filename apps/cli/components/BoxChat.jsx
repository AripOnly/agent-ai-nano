// Chat.jsx

import React from "react";
import { Text, Box } from "ink";
import User from "./User.jsx";
import Response from "./Response.jsx";
import ToolCall from "./ToolCall.jsx";

export default function BoxChat({ chat }) {
  return chat.map((value, index) => {
    if (value.role === "user") {
      return <User key={index}>{value.content}</User>;
    }

    if (value.role === "assistant") {
      return <Response key={index} response={value.content} />;
    }

    if (value.role === "tool_call") {
      return <ToolCall key={index} toolCall={value.content} />;
    }

    if (value.role === "error") {
      return (
        <Text key={index} color="red">
          {value.content.message ?? value.content}
        </Text>
      );
    }
  });
}
