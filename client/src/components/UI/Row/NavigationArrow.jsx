import React from "react";
import { Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import styled from "styled-components";

import arrow from "images/arrow.svg";


// Background - fix for "responsive" designt
// TODO: remove bg and make media queries for different screen resolutions
const NavigationContainer = styled(Box)`
    height: 100%;
    min-width: 100px; 
    width: 100px; 
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0px 16px 16px 0px;
    background-color: #FFFDFB;
    &:hover {
      cursor: pointer;
      background-color: #f5f1ed;
    }
`

export default function NavigationArrow({ to }) {
  return (
    <Link to={to}>
      <NavigationContainer>
        <img src={arrow} height="24px" alt="" />
      </NavigationContainer>
    </Link>
  );
}
