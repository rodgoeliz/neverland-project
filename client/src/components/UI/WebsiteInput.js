import React from 'react';
import isWebsiteValid from '../../utils/websiteValidator';
import {FaRegCheckCircle} from 'react-icons/fa';
import BrandStyles from '../BrandStyles';
import styled from "styled-components";

const styles = {
  container: {
    'background-color': BrandStyles.color.xlightBeige,
  },
};

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

export default class WebsiteInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      website: '',
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
    let website = this.props.value;
    if (website) {
      this.setState({
        website
      })
    }
    if (error) {
      this.setState({
        error,
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.error != nextProps.error) {
      this.setState({ error: nextProps.error });
    }
  }

  validateInput() {
    let hasError = !isWebsiteValid(this.state.website);
    let errorMessage = '';
    if (hasError) {
      errorMessage = 'Please enter a valid website.';
    } else {
      errorMessage = '';
    }
    this.setState(
      {
        error: errorMessage,
        hasError,
      },
      () => {
        this.props.onChange('website', this.state);
      },
    );
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
    let showName = this.props.showName;
    let nameInput = null;
    let style = this.state.error ? BrandStyles.components.errorInput : BrandStyles.components.input;
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
          <span style={labelStyle}>Website</span>
          <div style={BrandStyles.components.inputBase.contentWrapper}>
            <StyledInput
              placeholder="Website or Store Link (FB, Etsy, etc) (https)"
              autoCapitalize="none"
              style={BrandStyles.components.inputBase.textInput}
              value={this.state.website}
              onSubmitEditing={() => {
                this.validateInput();
              }}
              onChange={(e) => {
                this.onChangeInput('website', e);
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
