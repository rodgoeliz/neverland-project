import React, { Component } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import BrandStyles from '../BrandStyles';
import styled from 'styled-components';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

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
  button: {
    backgroundColor: BrandStyles.color.blue,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 8,
  },
};

export default class GAddressInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    };
    this.onNotFound = this.onNotFound.bind(this);
  }

  onNotFound() {
    this.setState({
      error: 'Could not find address. Please fill out manually.',
    });
  }

  handleChange = address => {
    this.setState({ address });
  };
   
  handleSelect = address => {
    this.setState({address})
    geocodeByAddress(address)
      .then(results => {
        if (results.length > 0) {
          this.props.onAddressDetails(results[0]);
        } else {
          return;
        }
        {/*let streetNumber = '';
        let route = '';
        let state = '';
        let zipCode = '';
        let county = '';
        let city = '';
        let addressComponents = results[0]["address_components"];
        for (var i in addressComponents) {
          let component = addressComponents[i];
          if (component.types && component.types.length > 0) {
            let mainType = component.types[0];
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
            }
          }
        }
        let newState = {
          street: streetNumber + ' ' + route,
          city: city,
          county: county,
          zip_code: zipCode,
          state: state
        };
        this.setState(newState, () => {
          let hasError = this.validateInput();
          this.setState(
            {
              hasError,
            },
            () => {
              this.props.onChange(this.state);
            },
          );
        });*/}
      })
      .then(latLng => console.log('Success', this.state))
      .catch(error => console.error('Error', error));
  };

  render() {
    let containerStyle = this.state.error
      ? BrandStyles.components.inputBase.errorContainer
      : BrandStyles.components.inputBase.container;
    let labelStyle = this.state.error
      ? BrandStyles.components.inputBase.errorLabel
      : BrandStyles.components.inputBase.label;
    let wrapperContainerStyle = {...containerStyle, flex: 0};
    let inputBaseContentWrapper = {...BrandStyles.components.inputBase.contentWrapper, minHeight: 40, backgroundColor: BrandStyles.color.lightwarmBeige};
    return (
      <div style={BrandStyles.components.inputBase.wrapper}>
        <div style={wrapperContainerStyle}>
          <span style={labelStyle}>Search for an address</span>
          <div
            style={inputBaseContentWrapper}>
            <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <StyledInput
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
          </div>
        </div>
      </div>
    );
  }
}
