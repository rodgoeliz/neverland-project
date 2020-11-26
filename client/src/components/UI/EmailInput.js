import React from 'react';
import {FaRegCheckCircle} from 'react-icons/fa';
import isEmailValid from '../../utils/emailValidator';
import BrandStyles from '../BrandStyles';
import styled from 'styled-components';

const StyledInput = styled.input`
  font-size: 18px;
  flex: 1;
  padding-left: 4px;
  background-color: transparent;
  border: 0;
  &:focus {
    outline: none
  } 
`
const styles = {
  container: {
    backgroundColor: BrandStyles.color.xlightBeige,
  },
};

export default class EmailInput extends React.Component {
  constructor(props) {
    super(props);
    let hasErrorState = true;
    let errorState = '';
    if (props.error) {
      this.state.hasError = true;
      this.state.error = props.error;
    }
    this.state = {
      email: '',
      error: errorState,
      hasError: hasErrorState,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.error != nextProps.error) {
      this.setState({ error: nextProps.error });
    }
  }

  validateInput() {
    const hasError = !isEmailValid(this.state.email);
    let errorMessage = '';
    if (hasError) {
      errorMessage = 'Please enter a valid email.';
    } else {
      errorMessage = '';
    }
    this.setState(
      {
        error: errorMessage,
        hasError: errorMessage.length > 0,
      },
      () => {
        this.props.onChange('email', this.state);
        console.log('Set error in validate input');
      },
    );
  }

  onChangeInput(key, value) {
    let typingTimeout = this.state.typingTimeout;
    if (typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      email: value.target.value,
      typing: false,
      typingTimeout: setTimeout(() => {
        this.validateInput();
      }, 500),
    });
  }

  render() {
    const style = this.state.error
      ? BrandStyles.components.errorInput
      : BrandStyles.components.input;
    let containerStyle = this.state.error
      ? BrandStyles.components.inputBase.errorContainer
      : BrandStyles.components.inputBase.container;
    let labelStyle = this.state.error
      ? BrandStyles.components.inputBase.errorLabel
      : BrandStyles.components.inputBase.label;
    let validationIcon = null;
    if (!this.state.hasError) {
      validationIcon = (<FaRegCheckCircle style={BrandStyles.components.inputBase.validationIcon} />);
    }
    return (
      <div style={BrandStyles.components.inputBase.wrapper}>
        <div style={containerStyle}>
          <span style={labelStyle}> Email </span>
          <div style={BrandStyles.components.inputBase.contentWrapper}>
            <StyledInput
              style={BrandStyles.components.inputBase.textInput}
              placeholder="Email"
              value={this.state.email}
              autoCapitalize="none"
              onSubmitEditing={() => {
                this.validateInput();
              }}
              onChange={(e) => {
                this.onChangeInput('email', e);
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
