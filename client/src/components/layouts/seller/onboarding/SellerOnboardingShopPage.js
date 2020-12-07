import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Redirect} from "react-router-dom";
import styled from 'styled-components';
import AddressInput from "../../../UI/AddressInput";
import { getNextOnBoardingStepId } from '../../../../utils/helpers';
import { sellerOnBoardingSteps } from "../../../../constants/onBoardingSteps";
import OnboardingHeader from "./OnboardingHeader";
import OnboardingImageWrapper from "./OnboardingImageWrapper";
import NSelect from "../../../UI/NSelect";
import NButton from "../../../UI/NButton";
import BaseInput from "../../../UI/BaseInput";
import WebsiteInput from "../../../UI/WebsiteInput";
import BrandStyles from "../../../BrandStyles";
import isWebsiteValid from '../../../../utils/websiteValidator';
import isFullNameValid from '../../../../utils/fullNameValidator';
import isEmailValid from '../../../../utils/emailValidator';
import { onSubmitStep } from "../../../../actions/seller";
import { setOnBoardingStepId } from "../../../../actions/auth";

const STEP_ID = sellerOnBoardingSteps.SIGNUP_SHOP_BASICS;

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
  margin-right: 16px;
  width: 100%;
  padding: 16px;
  height: 100px;
  display: flex;
  flex-direction: column;
  &:focus {
    outline: none
  } 
`;
/**
  {
  shopTitle
  shopHandle
  shopWebsite
  shopDescription
  shopAddress
  isShopOwner
  shopOwners
  }
**/
class SellerOnboardingShopPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        isShopOwner: 'yes',
      },
      toNextStep: false
    };

    this.onChangeAddressInput = this.onChangeAddressInput.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onChangeInputText = this.onChangeInputText.bind(this);
    this.onChangePickerInput = this.onChangePickerInput.bind(this);
    this.validateAddressInfo = this.validateAddressInfo.bind(this);
    this.validateShopInput = this.validateShopInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit() {
    if (this.validateShopInput()) {
      let input = {
        stepId: STEP_ID,
        formData: this.state.formData,
        userId: this.props.user._id
      };
      await this.props.onSubmitStep(input);
      await this.props.setOnBoardingStepId(getNextOnBoardingStepId(this.props.onboardingStepId, true));
      this.setState({
        toNextStep: true
      });
    }
  }

  onChangeAddressInput(addressState) {
    let newFormData = { ...this.state.formData };
    newFormData.shopAddressInput = addressState;
    this.setState({
      formData: newFormData,
    });
  }

  onChangeInputText(key, value) {
    let newFormData = { ...this.state.formData };
    newFormData[key] = value;
    this.setState({
      formData: newFormData,
    });
  }

  onChangeInput(key, value) {
    let newFormData = { ...this.state.formData };
    newFormData[key] = value[key];
    this.setState({
      formData: newFormData,
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

  validateAddressInfo() {
    if (!this.state.formData.shopAddressInput) {
      this.setState({
        shopAddressInputError: 'Please fill out address.',
      });
      return false;
    } else {
      this.setState({
        shopAddressInputError: '',
      });
      return !this.state.formData.shopAddressInput.hasError;
    }
  }

  validateShopInput() {
    let isValid = true;
    let sTitle = this.state.formData.shopTitle;
    let sHandle = this.state.formData.shopHandle;
    let sWebsite = this.state.formData.shopWebsite;
    let sDesc = this.state.formData.shopDescription;
    let sAddress = this.state.formData.shopAddressInput;
    let shopOwnerName = this.state.formData.shopOwnerName;
    let shopOwnerEmail = this.state.formData.shopOwnerEmail;
    let isShopOwner = this.state.formData.isShopOwner;
    if (isShopOwner === 'no') {
      if (!shopOwnerName || shopOwnerName === '' || !isFullNameValid(shopOwnerName)) {
        console.log('shopOwnerName not valid');
        this.setState({
          shopOwnerNameError: 'Please enter a valid full name.',
        });
      } else {
        this.setState({
          shopOwnerNameError: '',
        });
      }

      if (!shopOwnerEmail || shopOwnerEmail === '' || !isEmailValid(shopOwnerEmail)) {
        this.setState({
          shopOwnerEmailError: 'Please enter a valid email.',
        });
      } else {
        this.setState({
          shopOwnerEmailError: '',
        });
      }
    }

    if (!sTitle || sTitle.length < 4) {
      this.setState({
        shopTitleError: 'Shop title must be longer than 4 characters',
      });
      console.log('TITLE NOT VALID');
      isValid = false;
    } else {
      this.setState({
        shopTitleError: '',
      });
    }

    if (!sDesc || sDesc.length < 30) {
      console.log('desc not valid');
      this.setState({
        shopDescriptionError: 'Please provide more details about your shop.',
      });
      isValid = false;
    } else {
      this.setState({
        shopDescriptionError: '',
      });
    }

    if (!isWebsiteValid(sWebsite)) {
      console.log('website not valid');
      this.setState({
        shopWebsiteError: 'Must be a valid website.',
      });
      isValid = false;
    } else {
      this.setState({
        shopWebsiteError: '',
      });
    }
    isValid = this.validateAddressInfo();
    return isValid;
  }

  validateTitle(title) {
    return title && title.length > 2;
  }

  render() {
    if (this.state.toNextStep) {
      return (<Redirect to="/seller/onboarding/products" />);
    }
    let shopOwnersInput = null;
    if (this.state.formData.isShopOwner === 'no') {
      shopOwnersInput = (
        <div style={{ marginTop: 8 }}>
          <BaseInput
            onChange={this.onChangeInputText}
            keyId="shopwOwnerName"
            validate={isFullNameValid}
            label="Shop Owner Name"
            error={this.state.shopOwnerNameError}
          />
          <BaseInput
            onChange={this.onChangeInputText}
            keyId="shopOwnerEmail"
            validate={isEmailValid}
            label="Shop Owner Email"
            error={this.state.shopOwnerEmailError}
          />
        </div>
      );
    }
    let containerStyle = {...BrandStyles.components.onboarding.container, justifyContent: 'center'};
    return (
      <OnboardingImageWrapper>
        <OnboardingHeader />
        <div style={containerStyle}>
          <div
            style={{ marginTop: 32 }}
            enableResetScrollToCoords={false}
            behavior="padding"
            keyboardShouldPersistTaps="handled"
            keyboardVerticalOffset={30}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                textAlign: 'center',
                padding: 16,
              }}
            >
              Shop Information
            </span>
            {/*<TouchableOpacity onPress={this.props.signOut}>
              <Text>Logout</Text>
            </TouchableOpacity>*/}
            <form>
              <BaseInput
                onChange={this.onChangeInputText}
                keyId="shopTitle"
                autoCapitalize={'words'}
                validate={this.validateTitle}
                label="Shop Name"
                error={this.state.shopTitleError}
              />
              <WebsiteInput onChange={this.onChangeInput} error={this.state.websiteError} />
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
              <TextAreaInput
                multiline={true}
                onChange={(value) => {
                  this.onChangeInputText('shopDescription', value.target.value);
                }}
                placeholder="Description"
              />
              <span> {this.state.shopDescriptionError}</span>
              <span
                style={{
                  paddingLeft: 16,
                  fontWeight: 'bold',
                  paddingBottom: 4,
                  fontSize: 16,
                }}
              >
                Are you the shop owner?
              </span>
              <NSelect
                items={[
                  { id: 'yes', value: 'Yes' },
                  { id: 'no', value: 'No' },
                ]}
                isSingleSelect={true}
                itemIdKey="id"
                itemTitleKey="value"
                hideSelectedTags={true}
                placeholderText={'Are you the shop owner...'}
                onChangeItems={this.onChangeNSelectInput.bind(this, 'isShopOwner')}
              />
              {shopOwnersInput}
              <span> {/*error message*/}</span>
              <h3 style={{ fontWeight: 'bold', textAlign: 'center' }}>Business or Shop Address</h3>
              <span>{this.state.shopAddressInputError}</span>
              <AddressInput theme="light" onChange={this.onChangeAddressInput} />
              <NButton onClick={this.onSubmit} title={'Next'} />
            </form>
            <div style={{ height: 104 }} />
          </div>
        </div>
      </OnboardingImageWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth,
    onboardingStepId: state.auth.onboardingStepId,
  }
}

export default connect(mapStateToProps, { onSubmitStep, setOnBoardingStepId })(SellerOnboardingShopPage);