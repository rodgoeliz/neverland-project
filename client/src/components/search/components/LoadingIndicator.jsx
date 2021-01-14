import React from 'react';
import { connectStateResults } from "react-instantsearch-dom";
import styled from 'styled-components';

const LoadingContainer = styled.div`
  height: 100%;
  width: 60vw;
  display: flex;
  justify-content: center
`;

export default connectStateResults(
  ({ isSearchStalled }) => isSearchStalled 
    ? <LoadingContainer>Loading</LoadingContainer> : null
  );

