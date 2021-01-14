import React from 'react';
import { Box } from '@material-ui/core';
import styled from "styled-components";


const ImageContainer = styled(Box)`
    min-width: 150px; 
    width: 150px; 
    height: 150px;
    border-radius: 16px;
    padding: 0 ${props => props.theme.spacing.two}px;

    & > * {
      object-fit: cover;
      width: 100%;
      height: 100%;
      border-radius: 16px;
      padding-top: 16px;
      padding-bottom: 16px;
    }
`
export default function Image({ src }) {
  return (
    <ImageContainer >
      <img style={{borderRadius: 16}} src={src} alt="" />
    </ImageContainer>
  );
}
