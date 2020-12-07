import React, { Component } from 'react';
import styled from 'styled-components';

const HoverCursorWrapper = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

class NClickableText extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (

        <HoverCursorWrapper onClick={this.props.onClick}>{this.props.title}</HoverCursorWrapper>
      );
  }
}

export default NClickableText;