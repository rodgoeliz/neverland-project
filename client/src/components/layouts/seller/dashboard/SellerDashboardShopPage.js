import React from 'react';
import { connect } from 'react-redux';

import styled from 'styled-components';

import NButton from 'components/UI/NButton';
import AddressInput from 'components/UI/AddressInput';

import BaseInput from 'components/UI/BaseInput';
import WebsiteInput from 'components/UI/WebsiteInput';
import { getStore, updateStore } from 'actions/store';

import SellerDashboardNavWrapper from './SellerDashboardNavWrapper';

const TextAreaInput = styled.textarea`
  background-color: #f6f0e6;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border: 0px;
  border-bottom: 2px solid #1e1dcd !important;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  margin-top: 4px;
  padding-right: 16px;
  margin-left: 16px;
  margin-right: 32px;
  width: 100%;
  padding: 16px;
  height: 100px;
  display: flex;
  flex-direction: column;
  &:focus {
    outline: none;
  }
`;

class SellerDashboardShopPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        isShopOwner: true,
      },
    };

    this.onChangeAddressInput = this.onChangeAddressInput.bind(this);
    this.onChangeInputText = this.onChangeInputText.bind(this);
    this.onChangeNSelectInput = this.onChangeNSelectInput.bind(this);
    this.onChangePickerInput = this.onChangePickerInput.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this._loadStoreInfo = this._loadStoreInfo.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async _loadStoreInfo() {
    // let store = await this.props.loadStoreFromCacheOrBackend();
    let store = null;
    if (this.props.store && this.props.store.userIdToStoreCache) {
      store = this.props.store.userIdToStoreCache[this.props.auth._id];
    }
    if (!store) {
      store = await this.props.getStore(this.props.auth._id);
    }
    if (store) {
      this._loadStoreIntoForm(store);
      this.setState({
        store,
        isLoading: false,
      });
    } 
  }

  _loadStoreIntoForm(store) {
    const formData = {
      title: store.title,
      description: store.description,
      website: store.website,
      address: store.businessAddress,
    };
    this.setState({
      formData,
    });
  }

  componentDidMount() {
    // load store information here
    this.setState(
      {
        isLoading: true,
      },
      async () => {
        // call to load store info
        await this._loadStoreInfo();
      },
    );
  }

  onChangeAddressInput(addressState) {
    const newFormData = { ...this.state.formData };
    newFormData.address = {
      fullName: addressState.name,
      addressCity: addressState.city,
      addressCountry: addressState.country,
      addressCounty: addressState.county,
      addressZip: addressState.zip_code,
      addressLine1: addressState.street,
      addressLine2: addressState.street_two,
    };
    this.setState({
      formData: newFormData,
    });
  }

  onChangeInputText(key, value) {
    const newFormData = { ...this.state.formData };
    newFormData[key] = value;
    this.setState(
      {
        formData: newFormData,
      },
      () => { },
    );
  }

  onChangeInput(key, value) {
    const newFormData = { ...this.state.formData };
    newFormData[key] = value[key];
    this.setState(
      {
        formData: newFormData,
      },
      () => { },
    );
  }

  onChangeNSelectInput(key, values) {
    if (values.length > 0) {
      const newFormData = { ...this.state.formData };
      newFormData[key] = values[0].id;
      this.setState({
        formData: newFormData,
      });
    }
  }

  onChangePickerInput(key, value) {
    const newFormData = { ...this.state.formData };
    newFormData[key] = value;
    this.setState({
      formData: newFormData,
    });
  }

  async onSubmit() {
    await this.props.updateStore(this.state.store._id, this.state.formData);
    window.location.reload();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <SellerDashboardNavWrapper>
          <div> Pulling up your store info </div>
        </SellerDashboardNavWrapper>
      );
    }
    return (
      <SellerDashboardNavWrapper>
        <div style={{ maxWidth: '600px' }}>
          <h2> My Shop Details </h2>
          <p>
            {' '}
            Your shop name and description may be displayed to the public. You can update your shop information below.{' '}
          </p>
          <BaseInput
            onChange={this.onChangeInputText}
            keyId="title"
            autoCapitalize="words"
            validate={this.validateTitle}
            value={this.state.formData.title}
            label="Shop Name"
            error={this.state.shopTitleError}
          />
          <WebsiteInput
            value={this.state.formData.website}
            onChange={this.onChangeInput}
            error={this.state.websiteError}
          />
          <span
            style={{
              paddingLeft: 16,
              fontWeight: 'bold',
              paddingBottom: 4,
              fontSize: 16,
            }}
          >
            Describe your store to buyers.
          </span>
          <div style={{ paddingRight: 32 }}>
            <TextAreaInput
              multiline
              onChange={(value) => {
                this.onChangeInputText('description', value.target.value);
              }}
              value={this.state.formData.description}
              placeholder="Description"
            />
          </div>
          <span> {this.state.shopDescriptionError}</span>
          <h3 style={{ fontWeight: 'bold', textAlign: 'center' }}>Business or Shop Address</h3>
          <span>{this.state.shopAddressInputError}</span>
          <AddressInput theme="light" address={this.state.formData.address} onChange={this.onChangeAddressInput} />
          <NButton onClick={this.onSubmit} title="UPDATE" />
        </div>
      </SellerDashboardNavWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  store: state.store,
});

export default connect(mapStateToProps, { getStore, updateStore })(SellerDashboardShopPage);
