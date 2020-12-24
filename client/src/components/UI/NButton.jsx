import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';

import styled from 'styled-components';

import BrandStyles from 'components/BrandStyles';

const HoverCursorWrapper = styled.div`
  min-width: 300px;
  margin: 0 auto;
  &:hover {
    cursor: pointer;
  }
`;

const styles = {
  buttonSecondary: {
    borderColor: BrandStyles.color.blue,
    borderWidth: 2,
    minHeight: 50,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 32,
    minWidth: '20vw',
    maxWidth: '40vw',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  button: {
    backgroundImage: `linear-gradient(to bottom right, ${BrandStyles.color.blue}, rgb(2 0 144))`,
    minHeight: 50,
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 32,
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
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 32,
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  shadowButton: {
    boxShadow: `0px 2px 4px ${BrandStyles.color.blue}`,
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
    console.log('onClick');
    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      onClick();
    }
  };

  render() {
    console.log('isLoading', this.props.isLoading);
    const spinner = this.props.isLoading ? (
      <div style={styles.spinnerContainer}>
        <Spinner animation="border" variant="light" size="sm" />
      </div>
    ) : null;
    console.log('SPINNER', spinner);
    const themeStyle = this.props.theme === 'secondary' ? styles.buttonSecondary : styles.button;
    let buttonStyles = themeStyle;
    if (this.props.buttonStyle) {
      buttonStyles = { ...buttonStyles, ...this.props.buttonStyle };
    }
    if (this.props.theme === 'secondary') {
      buttonStyles = { ...buttonStyles, ...styles.secondaryHorizontalPadding };

      return (
        <HoverCursorWrapper>
          <div style={buttonStyles} {...this.props} onClick={this.onClick} disabled={this.props.disabled}>
            {this.props.iconLeft}
            <p style={styles.buttonTitleTextSecondary}>{this.props.title}</p>
            {this.props.iconRight}
            {spinner}
          </div>
        </HoverCursorWrapper>
      );
    }
    buttonStyles = { ...buttonStyles, ...styles.shadowButton };
    return (
      <HoverCursorWrapper>
        <div {...this.props} style={buttonStyles} onClick={this.onClick} disabled={this.props.disabled}>
          <div style={styles.linearGradient}>
            {this.props.iconLeft}
            <span style={styles.buttonTitleTextPrimary}>{this.props.title}</span>
            {this.props.iconRight}
            {spinner}
          </div>
        </div>
      </HoverCursorWrapper>
    );
  }
}

export default connect(null, {})(NButton);
