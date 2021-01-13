import React from 'react';
import { Box } from '@material-ui/core';
import styled from "styled-components";


const ImageContainer = styled(Box)`
    min-width: 150px; 
    width: 150px; 
<<<<<<< HEAD
    padding: ${props => props.theme.spacing.two}px;
=======
    padding: 0 ${props => props.theme.spacing.two}px;
>>>>>>> 0f7713626bdea472362e1bb558ecf61d2bac9642

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
