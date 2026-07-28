// Chat.jsx

import React, { useEffect } from "react";
import { Text, Box } from "ink";
import User from "./User.jsx";
import Response from "./Response.jsx";
import ToolCall from "./ToolCall.jsx";

export default function Chat({ chat }) {
  return chat.map((value, index) => {
    if (value.role === "user") {
      return <User key={index}>{value.content}</User>;
    }

    if (value.role === "model_output") {
      // console.log(value.content);
      return <Response key={index} response={value.content} />;
    }

    if (value.role === "function_call") {
      return <ToolCall key={index} toolCall={value.content} />;
    }
  });
}
