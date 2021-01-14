import { Box } from '@material-ui/core';
import styled from "styled-components";

export default styled(Box)`
  background-color: #FFFDFB;
  height: 180px;
  border-radius: 16px;
  -webkit-box-shadow: 10px 21px 54px -20px rgba(214,200,184,0.48);
  -moz-box-shadow: 10px 21px 54px -20px rgba(214,200,184,0.48);
  box-shadow: 10px 21px 54px -20px rgba(214,200,184,0.48); 
  width: calc(100vw - 540px);
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.three}px;
  &:hover {
    cursor: pointer;
  }
`;
