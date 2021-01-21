import React, { Component } from 'react';

import { Spinner } from 'react-bootstrap';

import { connect } from 'react-redux';

import styled from 'styled-components';

import BrandStyles from 'components/BrandStyles';

const HoverCursorWrapper = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const DisabledWrapper = styled.div`
  border: 0px;
  background-image: linear-gradient(to bottom right, rgb(196 192 183), rgb(168 159 140));
  border-radius: 8px;
  padding-top: ${props => (props.paddingFactor*8)}px;
  padding-bottom: ${props => (props.paddingFactor*8)}px;
  padding-right: ${props => (props.paddingFactor*16)}px;
  padding-left: ${props => (props.paddingFactor*16)}px;
  box-shadow: 0px 2px 4px rgb(196 192 183);
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center';
  &:hover: {
      cursor: pointer;
  };
`;

const PrimaryWrapper = styled.div`
  border: ${BrandStyles.color.blue} 2px solid;
  border-radius: 8px;
  padding-top: ${props => (props.paddingFactor*4)}px;
  padding-bottom: ${props => (props.paddingFactor*4)}px;
  padding-right: ${props => (props.paddingFactor*8)}px;
  padding-left: ${props => (props.paddingFactor*8)}px;
  background-image: linear-gradient(to bottom right, ${BrandStyles.color.blue}, rgb(2 0 144));
  box-shadow: 0px 2px 4px ${BrandStyles.color.blue};
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center';
  &:hover: {
      cursor: pointer;
  };
`;

const SecondaryWrapper = styled.div`
  border: ${BrandStyles.color.blue} 2px solid;
  border-radius: 8px;
  padding-top: ${props => (props.paddingFactor*4)}px;
  padding-bottom: ${props => (props.paddingFactor*4)}px;
  padding-right: ${props => (props.paddingFactor*8)}px;
  padding-left: ${props => (props.paddingFactor*8)}px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center';
  &:hover: {
      cursor: pointer;
  };
`;

const ButtonText = styled.span`
  font-size: ${props => (props.fontSize)};
  text-transform: uppercase;
  font-weight: bold;
  color: ${props => (props.theme === 'secondary' ? BrandStyles.color.blue : BrandStyles.color.beige)}
`;

const styles = {
contentContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    display: 'flex',
    flexDirection: 'row'
  },
  spinnerContainer: {
    height: 16,
    width: 16,
    marginHorizontal: 8,
    marginLeft: 16,
    display: 'flex',
  },
};

class NButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = async () => {
    const { onClick } = this.props;
    if (this.props.disabled) {
      return;
    }
    if (typeof onClick === 'function') {
      onClick();
    }
  };

  getPaddingFactor() {
     switch(this.props.size) {
      case 'x-small':
        return 1;
      case 'small': 
        return 1.25;
      case 'large':
        return 2;
      case 'medium':
      default: 
        return 1.5;
    }   
  }

  getTextSize() {
    switch(this.props.size) {
      case 'x-small':
        return '12px';
      case 'small': 
        return '16px';
      case 'large':
        return '24px';
      case 'medium':
      default: 
        return 'inherit';
    }
  }

  getColor() {
    return this.props.theme === 'primary' ? BrandStyles.color.beige : BrandStyles.color.blue;
  }

  render() {
    const spinner = this.props.isLoading ? (
      <div style={styles.spinnerContainer}>
        <Spinner animation="border" variant="light" size="sm" />
      </div>
    ) : null;

    const buttonContent = <div style={styles.contentContainer}>
              {this.props.iconLeft}
              <ButtonText theme={this.props.theme} fontSize={this.getTextSize()}>{this.props.title}</ButtonText>
              {this.props.iconRight}
              {spinner}
            </div>;
    if (this.props.disabled) {
      return (
        <HoverCursorWrapper onClick={this.onClick.bind(this)}>
          <DisabledWrapper paddingFactor={this.getPaddingFactor()}>
            {buttonContent}
          </DisabledWrapper>
        </HoverCursorWrapper>
        );
    }
    if (this.props.theme === 'secondary'){
      return (
        <HoverCursorWrapper onClick={this.onClick.bind(this)}>
          <SecondaryWrapper paddingFactor={this.getPaddingFactor()}>
            {buttonContent}
          </SecondaryWrapper>
        </HoverCursorWrapper>
        );
    }
    return (
      <HoverCursorWrapper onClick={this.onClick.bind(this)}>
        <PrimaryWrapper paddingFactor={this.getPaddingFactor()}>
          {buttonContent}
        </PrimaryWrapper>
      </HoverCursorWrapper>);

  }
}

export default connect(null, {})(NButton);
