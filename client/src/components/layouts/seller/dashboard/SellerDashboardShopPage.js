import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import NButton from '../../../UI/NButton';
import AddressInput from "../../../UI/AddressInput";
import NSelect from "../../../UI/NSelect";
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';
import BrandStyles from "../../../BrandStyles";
import BaseInput from "../../../UI/BaseInput";
import WebsiteInput from "../../../UI/WebsiteInput";
import { getStore, updateStore } from '../../../../actions/store';
import isWebsiteValid from '../../../../utils/websiteValidator';
import isFullNameValid from '../../../../utils/fullNameValidator';
import isEmailValid from '../../../../utils/emailValidator';
import SellerDashboardNavWrapper from './SellerDashboardNavWrapper';

const styles = {
  container: {
    backgroundColor: BrandStyles.color.beige,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
};

const TextAreaInput = styled.textarea`
  background-color: #F6F0E6;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border: 0px;
  border-bottom: 2px solid #1E1DCD !important;
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
    outline: none
  } 
`;

class SellerDashboardShopPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        isShopOwner: true
      }
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
    //let store = await this.props.loadStoreFromCacheOrBackend();
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
        isLoading: false
      });
    } else {
      console.log("TROUBLE LOADING STORE")
    }
  }

  _loadStoreIntoForm(store) {
    let formData = {
      title: store.title,
      description: store.description,
      website: store.website,
      address: store.businessAddress
    }
    this.setState({
      formData
    });
  }

  componentDidMount() {
    // load store information here 
    this.setState({
      isLoading: true
    }, async () => {
      // call to load store info
      await this._loadStoreInfo();
    })
  }

  onChangeAddressInput(addressState) {
    let newFormData = { ...this.state.formData };
    newFormData.address = {
      fullName: addressState.name,
      addressCity: addressState.city,
      addressCountry: addressState.country,
      addressCounty: addressState.county,
      addressZip: addressState.zip_code,
      addressLine1: addressState.street,
      addressLine2: addressState.street_two
    };
    this.setState({
      formData: newFormData,
    });
  }

  onChangeInputText(key, value) {
    let newFormData = { ...this.state.formData };
    newFormData[key] = value;
    this.setState({
      formData: newFormData,
    }, () => {
    });
  }

  onChangeInput(key, value) {
    let newFormData = { ...this.state.formData };
    newFormData[key] = value[key];
    this.setState({
      formData: newFormData,
    }, () => {
    });
  }

  onChangeNSelectInput(key, values) {
    if (values.length > 0) {
      let newFormData = { ...this.state.formData };
      newFormData[key] = values[0].id;
      this.setState({
        formData: newFormData,
      });
    }
  }

  onChangePickerInput(key, value) {
    let newFormData = { ...this.state.formData };
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
        </SellerDashboardNavWrapper>);
    }
    return (
      <SellerDashboardNavWrapper>
        <div style={{maxWidth: '600px'}}>
          Shop page
          <h2> My Shop Details </h2>
          <p> Your shop name and description may be displayed to the public. You can update your
          shop information below. </p>
              <BaseInput
                onChange={this.onChangeInputText}
                keyId="title"
                autoCapitalize={'words'}
                validate={this.validateTitle}
                value={this.state.formData.title}
                label="Shop Name"
                error={this.state.shopTitleError}
              />
              <WebsiteInput value={this.state.formData.website} onChange={this.onChangeInput} error={this.state.websiteError} />
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
              <div style={{paddingRight: 32}}>
              <TextAreaInput
                multiline={true}
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
              <NButton onClick={this.onSubmit} title={'UPDATE'} />
        </div>
      </SellerDashboardNavWrapper>
      );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    store: state.store
  }
}

export default connect(mapStateToProps, {getStore, updateStore})(SellerDashboardShopPage);
