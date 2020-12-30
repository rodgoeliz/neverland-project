import React from 'react';

import { FaRegCheckCircle } from 'react-icons/fa';

import styled from 'styled-components';

import isPasswordValid from 'utils/passwordValidator';
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

export default class PasswordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      error: '',
      hasError: true,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.error !== nextProps.error) {
      this.setState({ error: nextProps.error });
    }
  }

  validateInput() {
    const issues = isPasswordValid(this.state.password);
    const passwordErrorText = [];
    if (issues.length > 0) {
      for (const idx in issues) {
        const issue = issues[idx];
        if (issue === 'min') {
          passwordErrorText.push('Must be at least 8 characters.');
        } else if (issue === 'uppercase') {
          passwordErrorText.push('Must have at least one uppercase letter.');
        } else if (issue === 'lowercase') {
          passwordErrorText.push('Must have at least one lowercase letter.');
        } else if (issue === 'digits') {
          passwordErrorText.push('Must have at least one digit.');
        } else if (issue === 'spaces') {
          passwordErrorText.push('Can not have spaces.');
        }
      }
    }

    let errorMessage = '';
    if (issues.length > 0) {
      errorMessage = passwordErrorText.join(' ');
    } else {
      errorMessage = '';
    }
    this.setState(
      {
        error: errorMessage,
        hasError: errorMessage.length > 0,
      },
      () => {
        this.props.onChange('password', this.state);
      },
    );
  }

  onChangeInput(key, value) {
    const { typingTimeout } = this.state;
    if (typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      [key]: value.target.value,
      typing: false,
      typingTimeout: setTimeout(() => {
        this.validateInput();
      }, 500),
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
    let wrapperStyle = BrandStyles.components.inputBase.wrapper;
    if (this.props.style) {
      wrapperStyle = { ...wrapperStyle, ...this.props.style };
    }
    return (
      <div style={wrapperStyle}>
        <div style={containerStyle}>
          <span style={labelStyle}> Password </span>
          <div style={BrandStyles.components.inputBase.contentWrapper}>
            <StyledInput
              style={BrandStyles.components.inputBase.textInput}
              placeholder={this.props.placeholder || 'Password'}
              type="password"
              autoCapitalize="none"
              value={this.state.password}
              onSubmitEditing={() => {
                this.validateInput();
              }}
              onChange={(e) => {
                this.onChangeInput('password', e);
              }}
            />
            {validationIcon}
          </div>
        </div>
        <span style={BrandStyles.components.errorMessage}>{this.state.error}</span>
      </div>
    );
  }
}
