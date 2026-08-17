// Spinner.jsx

import React, { useEffect, useState } from "react";
import { Text } from "ink";
import spinners from "cli-spinners";

function Spinner({ type = "dots" }) {
  const spinner = spinners[type] ?? spinners.dots;
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((previousFrame) => (previousFrame + 1) % spinner.frames.length);
    }, spinner.interval);

    return () => clearInterval(timer);
  }, [spinner]);

  return <Text>{spinner.frames[frame]}</Text>;
}

export default Spinner;