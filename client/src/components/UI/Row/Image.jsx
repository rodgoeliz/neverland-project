import React from 'react';
import { Box } from '@material-ui/core';
import styled from "styled-components";


const ImageContainer = styled(Box)`
    width: 100px; 
    padding: 0 ${props => props.theme.spacing.one};

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
