import React, { Component } from 'react';

import { Spinner } from 'react-bootstrap';

import { connect } from 'react-redux';

import styled from 'styled-components';

import BrandStyles from 'components/BrandStyles';

const HoverCursorWrapper = styled.div`
  margin: 0 auto;
  &:hover {
    cursor: pointer;
  }
`;

const styles = {
  buttonXSmall: {
    maxHeight: 48, 
  },
  buttonSecondary: {
    borderColor: BrandStyles.color.blue,
    borderWidth: 2,
    borderRadius: 8,
    borderStyle: 'solid',
    minHeight: 50,
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 16,
    marginRight: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  buttonDisabled: {
    backgroundImage: `linear-gradient(to bottom right, rgb(196 192 183), rgb(168 159 140))`,
    minHeight: 50,
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  button: {
    backgroundImage: `linear-gradient(to bottom right, ${BrandStyles.color.blue}, rgb(2 0 144))`,
    minHeight: 50,
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  linearGradient: {
    flex: 1,
    borderRadius: 32,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  contentContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    display: 'flex',
    flexDirection: 'row'
  },
  shadowButton: {
    boxShadow: `0px 2px 4px ${BrandStyles.color.blue}`,
  },
  shadowButtonDisabled: {
    boxShadow: `0px 2px 4px rgb(168 159 140)`
  },
  buttonTitleTextPrimary: {
    color: BrandStyles.color.beige,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  buttonTitleTextSecondary: {
    color: BrandStyles.color.blue,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  secondaryHorizontalPadding: {
    paddingHorizontal: 32,
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

  getWidthStyle() {
    switch (this.props.size) {
      case 'x-small':
        const xSmallHeight = 48;
        return { 
          height: xSmallHeight,
        }
      default:
        const defaultHeight = 60;
       return {
        height: defaultHeight,
        width: 300
       }
    }
  }

  render() {
    console.log('isLoading', this.props.isLoading);
    const spinner = this.props.isLoading ? (
      <div style={styles.spinnerContainer}>
        <Spinner animation="border" variant="light" size="sm" />
      </div>
    ) : null;

    let themeStyle = this.props.theme === 'secondary' ? styles.buttonSecondary : styles.button;
    console.log("theme: ", this.props.theme, this.props.title)
    console.log(themeStyle)
    if (this.props.disabled) {
      themeStyle = styles.buttonDisabled
    }
    let buttonStyles = themeStyle;
    if (this.props.buttonStyle) {
      buttonStyles = { ...buttonStyles, ...this.props.buttonStyle };
    }
    const widthStyle = this.getWidthStyle();
    if (this.props.theme === 'secondary') {
      buttonStyles = { ...buttonStyles, ...styles.secondaryHorizontalPadding };

      return (
        <HoverCursorWrapper style={widthStyle}>
          <div style={{...buttonStyles, ...widthStyle}} {...this.props} onClick={this.onClick} disabled={this.props.disabled}>
            <div style={styles.contentContainer}>
              {this.props.iconLeft}
              <span style={styles.buttonTitleTextSecondary}>{this.props.title}</span>
              {this.props.iconRight}
              {spinner}
            </div>
          </div>
        </HoverCursorWrapper>
      );
    }
    if (this.props.disabled) {
      buttonStyles = {...buttonStyles, ...styles.shadowButtonDisabled}
    } else {
      buttonStyles = {...buttonStyles, ...styles.shadowButton};
    }
    return (
      <HoverCursorWrapper>
        <div {...this.props} style={buttonStyles} onClick={this.onClick} disabled={this.props.disabled}>
          <div style={{...styles.linearGradient, ...widthStyle}}>
            <div style={styles.contentContainer}>
              {this.props.iconLeft}
              <span style={styles.buttonTitleTextPrimary}>{this.props.title}</span>
              {this.props.iconRight}
              {spinner}
          </div>
          </div>
        </div>
      </HoverCursorWrapper>
    );
  }
}

export default connect(null, {})(NButton);
