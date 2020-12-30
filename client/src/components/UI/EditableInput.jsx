import React from 'react';

import { FaRegEdit } from 'react-icons/fa';

import styled from 'styled-components';

import BrandStyles from 'components/BrandStyles';


const styles = {
  optionEditIcon: {
    marginRight: 4,
  },
  optionEditContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    height: 60,
    backgroundColor: BrandStyles.color.warmlightBeige,
    borderBottomWidth: 2,
    borderColor: BrandStyles.color.blue,
  },
  optionEditContentWrapper: {
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'flex-start',
    flex: 1,
    height: 60
  },
  optionEditTextInputWrapper: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
  },
  optionEditTextInput: {
    flex: 1,
    minHeight: 32,
    marginRight: 4,
    marginTop: 2,
    marginLeft: 16,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  optionEditLabel: {
    marginTop: 4,
    marginLeft: 16,
  },
  iconSpacing: {
    marginRight: 8,
  },
};

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

export default class EditableInput extends React.Component {

  constructor(props) {
    super(props);
    let inputValue = '';
    if (props.value) {
      inputValue = props.value;
    }
    this.state = {
      isEditing: this.props.isEditing,
      [this.props.keyId]: inputValue,
      error: '',
      hasError: true,
      typing: false,
      typingTimeout: 0,
    };
    this.validateInput = this.validateInput.bind(this);
    this.setEditingState = this.setEditingState.bind(this);
    this.onChangeEditOptionText = this.onChangeEditOptionText.bind(this);
  }

  componentDidMount() {
    const { error } = this.props;
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
      const hasError = !this.props.validate(this.state[this.props.keyId]);
      let errorMessage = '';
      const lowercaseLabel = this.props.label.toLowerCase();
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
    } else {
      // automatically valid if no valid function provided
      this.props.onChange(this.props.keyId, this.state[this.props.keyId]);
    }
  }

  onChangeEditOptionText(value) {
    const { typingTimeout } = this.state;
    if (typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      [this.props.keyId]: value.target.value,
      typing: false,
      typingTimeout: setTimeout(() => {
        this.validateInput();
      }, 400),
    });
  }

  setEditingState(isEditing) {
    this.setState({
      isEditing
    }, () => {
      if (this.props.onEditChange && this.state.isEditing) {
        this.props.onEditChange(this.state.isEditing)
      }
    });
  }

  render() {
    const labelStyle = BrandStyles.components.inputBase.label;
    const spanEditStyle = { ...labelStyle, ...styles.optionEditLabel };
    const iconStyle = { ...BrandStyles.components.iconPlaceholder, ...styles.iconSpacing };
    let maxWidthStyle = {};
    let maxWidthTextStyle = {};
    if (this.props.maxWidth) {
      maxWidthStyle = {width: this.props.maxWidth};
      maxWidthTextStyle = {width: this.props.maxWidth - 32};
    }
    const inputComponent = this.state.isEditing ? (
        <div style={{...styles.optionEditContainer, ...maxWidthStyle}}>
          <div style={styles.optionEditContentWrapper}>
            <span style={spanEditStyle}>{this.props.label}</span>
            <div style={styles.optionEditTextInputWrapper}>
              <StyledInput
                style={{...styles.optionEditTextInput, ...maxWidthTextStyle}}
                value={this.state[this.props.keyId]}
                onChange={(value) => {
                  this.onChangeEditOptionText(value);
                }}
                onBlur={() => {
                  this.setEditingState(false);
                }}
                autoFocus
                onKeyDown={(e) => {
                 if (e.keyCode === 13) {
                 this.setEditingState(false);
                 }
                 }}
               />
            </div>
          </div>
       </div>
       ) : (
       <div style={{...styles.optionEditContainer, ...maxWidthStyle}}>
          <div style={styles.optionEditContentWrapper}>
            <span style={spanEditStyle}>{this.props.label}</span>
            <div style={styles.optionEditTextInputWrapper}>
            <span
              style={{...styles.optionEditTextInput, ...maxWidthTextStyle}}
              onClick={() => {
                this.setEditingState(true);
              }}
              >
                {this.state[this.props.keyId]}
            </span>
            <FaRegEdit style={iconStyle} />
            </div>
            </div>
        </div>);
       return (
          <div> { inputComponent } </div>);
  }
}
