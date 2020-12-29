import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { getNextOnBoardingStepId } from 'utils/helpers';

import isWebsiteValid from 'utils/websiteValidator';

import isFullNameValid from 'utils/fullNameValidator';

import isEmailValid from 'utils/emailValidator';

import BrandStyles from 'components/BrandStyles';

import AddressInput from 'components/UI/AddressInput';

import NSelect from 'components/UI/NSelect';
import NButton from 'components/UI/NButton';
import BaseInput from 'components/UI/BaseInput';
import WebsiteInput from 'components/UI/WebsiteInput';

import { onSubmitStep } from 'actions/seller';
import { setOnBoardingStepId } from 'actions/auth';

import { sellerOnBoardingSteps } from 'constants/onBoardingSteps';

import OnboardingImageWrapper from './OnboardingImageWrapper';
import OnboardingHeader from './OnboardingHeader';

const STEP_ID = sellerOnBoardingSteps.SIGNUP_SHOP_BASICS;

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
  margin-right: 16px;
  width: 100%;
  padding: 16px;
  height: 100px;
  display: flex;
  flex-direction: column;
  &:focus {
    outline: none;
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
* */
class SellerOnboardingShopPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        isShopOwner: 'yes',
      },
      toNextStep: false,
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
      const input = {
        stepId: STEP_ID,
        formData: this.state.formData,
        userId: this.props.user._id,
      };
      await this.props.onSubmitStep(input);
      await this.props.setOnBoardingStepId(getNextOnBoardingStepId(this.props.onboardingStepId, true));
      this.setState({
        toNextStep: true,
      });
    }
  }

  onChangeAddressInput(addressState) {
    const newFormData = { ...this.state.formData };
    newFormData.shopAddressInput = addressState;
    this.setState({
      formData: newFormData,
    });
  }

  onChangeInputText(key, value) {
    const newFormData = { ...this.state.formData };
    newFormData[key] = value;
    this.setState({
      formData: newFormData,
    });
  }

  onChangeInput(key, value) {
    const newFormData = { ...this.state.formData };
    newFormData[key] = value[key];
    this.setState({
      formData: newFormData,
    });
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

  validateAddressInfo() {
    if (!this.state.formData.shopAddressInput) {
      this.setState({
        shopAddressInputError: 'Please fill out address.',
      });
      return false;
    }
    this.setState({
      shopAddressInputError: '',
    });
    return !this.state.formData.shopAddressInput.hasError;
  }

  validateShopInput() {
    let isValid = true;
    const sTitle = this.state.formData.shopTitle;
    const sWebsite = this.state.formData.shopWebsite;
    const sDesc = this.state.formData.shopDescription;
    const { shopOwnerName } = this.state.formData;
    const { shopOwnerEmail } = this.state.formData;
    const { isShopOwner } = this.state.formData;
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

      isValid = false;
    }
    isValid = this.validateAddressInfo();
    return isValid;
  }

  validateTitle(title) {
    return title && title.length > 2;
  }

  render() {
    if (this.state.toNextStep) {
      return <Redirect to="/seller/onboarding/products" />;
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
    const containerStyle = { ...BrandStyles.components.onboarding.container, justifyContent: 'center' };
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
            {/* <TouchableOpacity onPress={this.props.signOut}>
              <Text>Logout</Text>
            </TouchableOpacity> */}
            <form>
              <BaseInput
                onChange={this.onChangeInputText}
                keyId="shopTitle"
                autoCapitalize="words"
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
                multiline
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
                isSingleSelect
                itemIdKey="id"
                itemTitleKey="value"
                hideSelectedTags
                placeholderText="Are you the shop owner..."
                onChangeItems={this.onChangeNSelectInput.bind(this, 'isShopOwner')}
              />
              {shopOwnersInput}
              <span> {/* error message */}</span>
              <h3 style={{ fontWeight: 'bold', textAlign: 'center' }}>Business or Shop Address</h3>
              <span>{this.state.shopAddressInputError}</span>
              <AddressInput theme="light" onChange={this.onChangeAddressInput} />
              <NButton onClick={this.onSubmit} title="Next" />
            </form>
            <div style={{ height: 104 }} />
          </div>
        </div>
      </OnboardingImageWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth,
  onboardingStepId: state.auth.onboardingStepId,
});

export default connect(mapStateToProps, { onSubmitStep, setOnBoardingStepId })(SellerOnboardingShopPage);
