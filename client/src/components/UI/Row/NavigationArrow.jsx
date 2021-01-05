import React from "react";
import { Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import styled from "styled-components";

import arrow from "images/arrow.svg";


const NavigationContainer = styled(Box)`
    height: 100%;
    min-width: 150px; 
    width: 150px; 
    display: flex;
    align-items: center;
    justify-content: center;
`

export default function NavigationArrow({ to }) {
  return (
    <Link to={to}>
      <NavigationContainer>
        <img src={arrow} height="50px" alt="" />
      </NavigationContainer>
    </Link>
  );
}
