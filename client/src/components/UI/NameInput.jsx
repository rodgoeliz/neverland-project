import React from 'react';

import { FaRegCheckCircle } from 'react-icons/fa';

import styled from 'styled-components';

import isFullNameValid from 'utils/fullNameValidator';
import BrandStyles from 'components/BrandStyles';

const StyledInput = styled.input`
  font-size: 18px;
  flex: 1;
  padding-left: 4px;
  background-color: transparent;
  border: 0;
  &:focus {
    outline: none;
  }
`;

export default class NameInput extends React.Component {
  constructor(props) {
    super(props);
    const hasErrorState = true;
    const errorState = '';
    if (props.error) {
      this.state.hasError = true;
      this.state.error = props.error;
    }
    this.state = {
      name: '',
      error: errorState,
      hasError: hasErrorState,
      typing: false,
      typingTimeout: 0,
    };
    this.onChangeInput = this.onChangeInput.bind(this);
    this.validateInput = this.validateInput.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.error !== nextProps.error) {
      this.setState({ error: nextProps.error });
    }
  }

  validateInput() {
    const hasError = !isFullNameValid(this.state.name);
    let errorMessage = '';
    if (hasError) {
      errorMessage = 'Please enter a valid name.';
    } else {
      errorMessage = '';
    }
    this.setState(
      {
        error: errorMessage,
        hasError,
      },
      () => {
        this.props.onChange('name', this.state);
      },
    );
  }

  onChangeInput(key, value) {
    const { typingTimeout } = this.state;
    if (typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      name: value.target.value,
      typing: false,
      typingTimeout: setTimeout(() => {
        this.validateInput();
      }, 400),
    });
  }

  render() {
    const containerStyle = this.state.error
      ? BrandStyles.components.inputBase.errorContainer
      : BrandStyles.components.inputBase.container;
    const labelStyle = this.state.error
      ? BrandStyles.components.inputBase.errorLabel
      : BrandStyles.components.inputBase.label;
    let validationIcon = null;
    if (!this.state.hasError) {
      validationIcon = <FaRegCheckCircle style={BrandStyles.components.inputBase.validationIcon} />;
    }
    return (
      <div style={BrandStyles.components.inputBase.wrapper}>
        <div style={containerStyle}>
          <span style={labelStyle}> Full Name </span>
          <div style={BrandStyles.components.inputBase.contentWrapper}>
            <StyledInput
              placeholder="Enter your full name"
              autoCapitalize="words"
              value={this.state.name}
              onSubmitEditing={() => {
                this.validateInput();
              }}
              onChange={(e) => {
                this.onChangeInput('name', e);
              }}
            />
            {validationIcon}
          </div>
        </div>
        <span style={BrandStyles.components.inputBase.errorMessage}>{this.state.error}</span>
      </div>
    );
  }
}
