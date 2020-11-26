import React from 'react';
import isPhoneNumberValid from '../../utils/phoneNumberValidator';
import BrandStyles from '../BrandStyles';
import {FaRegCheckCircle} from 'react-icons/fa';
import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import 'react-phone-number-input/style.css'
import {parsePhoneNumber} from 'react-phone-number-input';

const styles = {
  inputClass: {
    borderRadius: 0,
    backgroundColor: 'black'
  },
  container: {
    'background-color': BrandStyles.color.xlightBeige,
  },
};

export default class PhoneNumberInput extends React.Component {
  constructor(props) {
    super(props);
    let hasErrorState = true;
    let errorState = '';
    if (props.error) {
      this.state.hasError = true;
      this.state.error = props.error;
    }
    this.state = {
      phoneNumber: {
        number: '',
        countryCode: 'US'
      },
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
    let hasError = !isPhoneNumberValid(this.state.phoneNumber.number);
    let errorMessage = '';
    if (hasError) {
      errorMessage = 'Please enter a valid phone number.';
    } else {
      errorMessage = '';
    }
    this.setState(
      {
        error: errorMessage,
        hasError,
      },
      () => {
        this.props.onChange('phoneNumber', this.state);
        console.log('Set error in validate input');
      },
    );
  }

  onChangeInput(key, value) {
    let typingTimeout = this.state.typingTimeout;
    console.log("onChangePhoneInput", value);
    if (!value) {
      return
    }
    let phonenumber = parsePhoneNumber(value);
    if (typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    // get area code
    if (phonenumber) {
      this.setState(
        {
          [key]: {
            number: value,
            countryCode: phonenumber.country
          },
          typing: false,
          typingTimeout: setTimeout(() => {
            this.validateInput();
          }, 400),
        },
        () => {
          console.log(this.state)
          this.props.onChange(key, this.state);
        },
      );
    }
  }

  onChangePhoneNumberCountry(key, iso2) {
    if (this.phone) {
      this.setState(
        {
          [key]: {
            number: this.phone.getValue(),
            countryCode: this.phone.getCountryCode(),
          },
        },
        () => {
          this.props.onChange(key, this.state);
        },
      );
    }
  }

  onPressConfirm() {
    console.log('On press confirm');
  }

  render() {
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
          <span style={labelStyle}> Phone Number</span>
          <div style={BrandStyles.components.inputBase.contentWrapper}>
            <div>
            <PhoneInput
              value={this.state.phoneNumber.number}
              defaultCountry="US"
              inputClass={styles.inputClass}
              containerClass={styles.inputClass}
              onChange={(value) => {console.log(value); this.onChangeInput('phoneNumber', value);}}/>
              </div>
            {validationIcon}
          </div>
        </div>
        <p style={BrandStyles.components.inputBase.errorMessage}>{this.state.error}</p>
      </div>
    );
  }
}
