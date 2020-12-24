import React from 'react';
import styled from 'styled-components';

const HoverCursorWrapper = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

function NClickableText({ onClick, title }) {
  return <HoverCursorWrapper onClick={onClick}>{title}</HoverCursorWrapper>;
}

export default NClickableText;
