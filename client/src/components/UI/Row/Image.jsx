import React from 'react';
import { Box } from '@material-ui/core';
import styled from "styled-components";


const ImageContainer = styled(Box)`
    min-width: 150px; 
    width: 150px; 
    padding: ${props => props.theme.spacing.two}px;

    & > * {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
`
export default function Image({ src }) {
  return (
    <ImageContainer >
      <img src={src} alt="" />
    </ImageContainer>
  );
}
