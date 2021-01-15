import { Box } from '@material-ui/core';
import styled from "styled-components";

export default styled(Box)`
  background-color: #FFFDFB;
  height: 180px;
  border-radius: 16px;
  width: calc(100vw - 540px);
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.three}px;
  &:hover {
    cursor: pointer;
  }
`;
