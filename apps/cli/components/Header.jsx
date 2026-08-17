// Header.jsx

import React from "react";
import { Box } from "ink";
import Gradient from "ink-gradient";
import BigText from "ink-big-text";

const Header = ({ columns }) => {
  return (
    <Box marginBottom={1} justifyContent="center">
      <Box width={columns - 2}>
        <Gradient name="rainbow">
          <BigText text="NANO" />
        </Gradient>
      </Box>
    </Box>
  );
};

export default Header;