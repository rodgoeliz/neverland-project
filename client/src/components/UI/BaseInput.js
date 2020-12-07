import React from 'react';
import BrandStyles from '../BrandStyles';
import {FaRegCheckCircle} from 'react-icons/fa';
import styled from 'styled-components';

const styles = {
  container: {
    'background-color': BrandStyles.color.xlightBeige,
  },
};

const StyledTextArea = styled.textarea`
  font-size: 18px;
  flex: 1;
  padding-left: 4px;
  background-color: transparent;
  border: 0;
  &:focus {
    outline: none
  } 
`
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
export default class BaseInput extends React.Component {
  constructor(props) {
    super(props);
    let inputValue = '';
    if (props.value) {
      inputValue = props.value;
    }
    this.state = {
      [this.props.keyId]: inputValue,
      error: '',
      hasError: true,
      typing: false,
      typingTimeout: 0,
    };
    this.onChangeInput = this.onChangeInput.bind(this);
    this.validateInput = this.validateInput.bind(this);
  }

  componentDidMount() {
    let error = this.props.error;
    if (error) {
      this.setState({
        error,
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        [this.props.keyId]: nextProps.value,
      });
    }
    if (this.props.error !== nextProps.error) {
      this.setState({ error: nextProps.error });
    }
  }

  validateInput() {
    if (this.props.validate) {
      let hasError = !this.props.validate(this.state[this.props.keyId]);
      let errorMessage = '';
      let lowercaseLabel = this.props.label.toLowerCase();
      if (hasError) {
        errorMessage = `Please enter a valid ${lowercaseLabel}.`;
      } else {
        errorMessage = '';
      }
      this.setState(
        {
          error: errorMessage,
          hasError,
        },
        () => {
          this.props.onChange(this.props.keyId, this.state[this.props.keyId]);
        },
      );
      return;
    } else {
      // automatically valid if no valid function provided
      this.props.onChange(this.props.keyId, this.state[this.props.keyId]);
    }
  }

  onChangeInput(key, value) {
    let typingTimeout = this.state.typingTimeout;
    if (typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      [key]: value.target.value,
      typing: false,
      typingTimeout: setTimeout(() => {
        this.validateInput();
      }, 400),
    });
  }

  render() {
    let style = this.state.error ? BrandStyles.components.errorInput : BrandStyles.components.input;
    let widthFactor = 1; // full

    if (this.props.widthFactor) {
      widthFactor = this.props.widthFactor;
    }

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
    let autoCap = 'none';
    if (this.props.autoCapitalize) {
      autoCap = this.props.autoCapitalize;
    }
    let widthStyle = { width: `(400 - 32) / ${widthFactor }`};
    if (this.props.full) {
      widthStyle = { flex: 1 };
    }
    let wrapperStyle = widthStyle;
    if (this.props.style) {
      wrapperStyle = {...wrapperStyle, ...this.props.style};
    }
    let inputComponent = (
          <StyledInput
                keyboardType={this.props.keyboardType ? this.props.keyboardType : 'default'}
                style={BrandStyles.components.inputBase.textInput}
                placeholder={`Enter ${this.props.label.toLowerCase()}`}
                multiline={this.props.multiline}
                autoCapitalize={autoCap}
                value={this.state[this.props.keyId]}
                onSubmitEditing={() => {
                  this.validateInput();
                }}
                onChange={(e) => {
                  this.onChangeInput(this.props.keyId, e);
                }}
              />);
    if (this.props.multiline) {
        inputComponent =       
              <StyledTextArea
                keyboardType={this.props.keyboardType ? this.props.keyboardType : 'default'}
                style={BrandStyles.components.inputBase.textInput}
                placeholder={`Enter ${this.props.label.toLowerCase()}`}
                multiline={this.props.multiline}
                autoCapitalize={autoCap}
                value={this.state[this.props.keyId]}
                onSubmitEditing={() => {
                  this.validateInput();
                }}
                onChange={(e) => {
                  this.onChangeInput(this.props.keyId, e);
                }}
              />
    }
    return (
      <div style={wrapperStyle}>
        <div style={BrandStyles.components.inputBase.wrapper}>
          <div style={containerStyle}>
            <span style={labelStyle}>{this.props.label}</span>
            <div style={BrandStyles.components.inputBase.contentWrapper}>
              {inputComponent}
            </div>
          </div>
          <span style={BrandStyles.components.inputBase.errorMessage}>{this.state.error}</span>
        </div>
      </div>
    );
  }
}
