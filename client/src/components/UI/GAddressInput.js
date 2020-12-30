import React, { Component } from 'react';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';

import styled from 'styled-components';

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

  handleChange = (address) => {
    this.setState({ address });
  };

  handleSelect = (address) => {
    this.setState({ address });
    geocodeByAddress(address)
      .then((results) => {
        if (results.length > 0) {
          this.props.onAddressDetails(results[0]);
        }
      })
      .then(() => console.log('Success', this.state))
      .catch((error) => console.error('Error', error));
  };

  render() {
    const containerStyle = this.state.error
      ? BrandStyles.components.inputBase.errorContainer
      : BrandStyles.components.inputBase.container;
    const labelStyle = this.state.error
      ? BrandStyles.components.inputBase.errorLabel
      : BrandStyles.components.inputBase.label;
    const wrapperContainerStyle = { ...containerStyle, flex: 0 };
    const inputBaseContentWrapper = {
      ...BrandStyles.components.inputBase.contentWrapper,
      minHeight: 40,
      backgroundColor: BrandStyles.color.lightwarmBeige,
    };
    return (
      <div style={BrandStyles.components.inputBase.wrapper}>
        <div style={wrapperContainerStyle}>
          <span style={labelStyle}>Search for an address</span>
          <div style={inputBaseContentWrapper}>
            <PlacesAutocomplete value={this.state.address} onChange={this.handleChange} onSelect={this.handleSelect}>
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
                    {suggestions.map((suggestion) => {
                      const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
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
