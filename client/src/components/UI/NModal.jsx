import React, { Component } from 'react';

import { connect } from 'react-redux';

import styled from 'styled-components';

// import BrandStyles from 'components/BrandStyles';

const StickyModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(255,255,255, .75);
  width: 100vw;
  justify-content: center;
  display: flex;
`;

const ModalContainer = styled.div`
  justify-content: center;
  display: flex;
  margin-top: 32px;
  margin-bottom: 32px;
`;
const ModalHeader = styled.div``;

const ModalStickyHeader = styled.div`
  position: sticky;
  top: 0;
`;

const ModalContentWrapper = styled.div`
  overflow: auto;
  position: absolute;
  inset: 40;
  border: 1px solid gray;
  border-radius: 32px;
  outline: none;
  padding: 24px;
`;

const ModalContent = styled.div`
  flex: 1 1 0%;
`;

class NModal extends Component {

  onClickClose = async () => {

  };

  onShouldCloseOnOverlayClick = async (event) => {
    console.log("CLICK EVENT: ", event, event.target, this.modalOverlayonClick)
    if (event.target === this.modalOverlayonClick) {
      if (this.props.shouldCloseOnOverlayClick) {
        this.props.onRequestClose();
      }
    }
  }

  render() {
    const { style, renderHeader, stickyHeader, animationType, shouldCloseOnOverlayClick, onRequestClose, isOpen} = this.props;
    console.log(style, animationType, shouldCloseOnOverlayClick, onRequestClose, isOpen)
    console.log("NModal", this.props)
    if (!isOpen) {
      return null;
    }

    let headerComponent = null;
    if (renderHeader) {
      headerComponent = stickyHeader 
        ? <ModalStickyHeader>{renderHeader()}</ModalStickyHeader>
        : <ModalHeader>{renderHeader()}</ModalHeader>
    }
    return(
      <StickyModalOverlay ref={(ref) => {this.modalOverlayonClick=ref;}} onClick={this.onShouldCloseOnOverlayClick.bind(this)}>
        <ModalContainer>
          {headerComponent}
          <ModalContentWrapper>
            <ModalContent>
              {this.props.children}
            </ModalContent>
          </ModalContentWrapper>
        </ModalContainer>
      </StickyModalOverlay>
      );
  }
}

export default connect(null, {})(NModal);
