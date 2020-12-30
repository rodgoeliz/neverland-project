import React from 'react';

import GAddressInput from './GAddressInput';
import BaseInput from './BaseInput';
import NameInput from './NameInput';

const styles = {
  container: {},
  darkContainer: {},
};

export default class AddressInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onChangeAddressInput = this.onChangeAddressInput.bind(this);
    this.onChangeAddressDetails = this.onChangeAddressDetails.bind(this);
  }

  componentDidMount() {
    const { address } = this.props;
    if (address) {
      this.setState({
        full_name: address.fullName,
        name: address.fullName,
        street: address.addressLine1,
        street_two: address.addressLine2,
        city: address.addressCity,
        state: address.addressState,
        country: address.addressCountry,
        zip_code: address.addressZip,
      });
    }
  }

  validateInput(key) {
    let hasError = false;

    // Full Name
    const fullName = this.state.name;
    const validFullName = /^([\w]{2,})+\s+([\w\s]{2,})+$/.test(fullName);
    if (!validFullName && this.props.showName && (key === 'name' || key === undefined)) {
      hasError = true;
      this.setState({
        nameError: 'Must be a valid name.',
      });
    } else {
      this.setState({
        nameError: '',
      });
    }
    if (key === 'name') {
      return;
    }

    // state
    const { state } = this.state;

    if ((!state || state.length !== 2) && (key === 'state' || key === undefined)) {
      this.setState({
        stateError: 'Must be more than 2 characters in length.',
      });
      hasError = true;
    } else {
      this.setState({
        stateError: '',
      });
    }

    if (key === 'state') {
      return;
    }

    // zip code
    const zipCode = this.state.zip_code;
    if ((!zipCode || zipCode.length !== 5) && (key === 'zip_code' || key === undefined)) {
      this.setState({
        zipCodeError: 'Must be a valid zipcode.',
      });
      hasError = true;
    } else {
      this.setState({
        zipCodeError: '',
      });
    }
    if (key === 'zip_code') {
      return;
    }
    return hasError;
  }

  onChangeAddressInput(key, value) {
    this.setState(
      {
        [key]: value[key],
      },
      () => {
        const hasError = this.validateInput(key);
        this.setState(
          {
            hasError,
          },
          () => {
            this.props.onChange(this.state);
          },
        );
      },
    );
  }

  onChangeAddressDetails(details) {
    const addressComponents = details.address_components;
    let streetNumber = '';
    let route = '';
    let state = '';
    let county = '';
    let zipCode = '';
    let city = '';
    for (const i in addressComponents) {
      const component = addressComponents[i];
      if (component.types && component.types.length > 0) {
        const mainType = component.types[0];
        switch (mainType) {
          case 'street_number':
            streetNumber = component.long_name;
            break;
          case 'route':
            route = component.long_name;
            break;
          case 'administrative_area_level_2':
            county = component.long_name;
            break;
          case 'administrative_area_level_1':
            state = component.short_name;
            break;
          case 'postal_code':
            zipCode = component.long_name;
            break;
          case 'locality':
            city = component.long_name;
            break;
          default:
            break;
        }
      }
    }
    const newState = {
      street: `${streetNumber} ${route}`,
      city,
      county,
      zip_code: zipCode,
      state,
    };
    this.setState(newState, () => {
      const hasError = this.validateInput();
      this.setState(
        {
          hasError,
        },
        () => {
          this.props.onChange(this.state);
        },
      );
    });
  }

  render() {
    const { themeTypeKey } = this.props;
    const backgroundContainerStyle = themeTypeKey || themeTypeKey === 'light' ? styles.container : styles.darkContainer;

    return (
      <div style={backgroundContainerStyle}>
        <form>
          <NameInput onChange={this.onChangeAddressInput} value={this.state.name} error={this.state.nameError} />
          <GAddressInput onAddressDetails={this.onChangeAddressDetails} />
          <BaseInput
            onChange={this.onChangeAddressInput}
            keyId="street"
            value={this.state.street ? this.state.street : ''}
            label="Street Address"
          />
          <BaseInput
            onChange={this.onChangeAddressInput}
            keyId="street_two"
            value={this.state.street_two}
            label="Apt/Suite/Other (Optional)"
          />
          <BaseInput onChange={this.onChangeAddressInput} keyId="city" value={this.state.city} label="City" />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <BaseInput
              onChange={this.onChangeAddressInput}
              widthFactor={3}
              keyId="state"
              value={this.state.state}
              label="State"
            />
            <BaseInput
              onChange={this.onChangeAddressInput}
              widthFactor={2}
              keyId="zip_code"
              value={this.state.zip_code}
              label="Zip Code"
            />
          </div>
        </form>
      </div>
    );
  }
}