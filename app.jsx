import React from "react";
import { render } from "ink";
import App from "./src/channels/cli/App.jsx";

try {
  const { waitUntilExit } = render(<App />, {
    incrementalRendering: true,
    maxFps: 20,
  });
  await waitUntilExit();
} catch (error) {
  console.log(error.stack);
}
