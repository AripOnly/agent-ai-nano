import React from "react";
import { render } from "ink";
import App from "./apps/cli/App";

try {
  const { waitUntilExit } = render(<App />);
  await waitUntilExit();
} catch (error) {
  console.log(error.stack);
}
