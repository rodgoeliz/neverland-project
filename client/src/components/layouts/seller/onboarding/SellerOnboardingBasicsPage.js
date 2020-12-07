import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Redirect} from "react-router-dom";
import styled from 'styled-components';
import {Accordion, Card, Button, Carousel} from 'react-bootstrap';
import OnboardingHeader from "./OnboardingHeader";
import OnboardingImageWrapper from "./OnboardingImageWrapper";
import NSelect from "../../../UI/NSelect";
import NButton from "../../../UI/NButton";
import NameInput from "../../../UI/NameInput";
import AddressInput from "../../../UI/AddressInput";
import PhoneNumberInput from "../../../UI/PhoneNumberInput";
import BrandStyles from "../../../BrandStyles";
import queryString from 'query-string';
import { getNextOnBoardingStepId } from '../../../../utils/helpers';
import { sellerOnBoardingSteps } from "../../../../constants/onBoardingSteps";
import { onSubmitStep } from "../../../../actions/seller";
import { setOnBoardingStepId } from "../../../../actions/auth";

const stateData = require('../../../../constants/states');
const sellerProductData = require('../../../../constants/sellerProductsSelect');
const sellerStores = require('../../../../constants/sellerStores');

const STEP_ID = sellerOnBoardingSteps.SIGNUP_BASICS;

const WHY_SIGNUP_NVLND = [
  {
    id: 'just-curious',
    name: 'Just curious',
  },
  {
    id: 'want-to-checkout',
    name: 'Want to check it out',
  },
  {
    id: 'reach-more-customers',
    name: 'Want to reach more customers',
  },
  {
    id: 'sell-on-plant-only-market',
    name: 'Sell on a plant-only marketplace',
  },
  {
    id: 'minimal-seller-fees',
    name: 'Minimal seller transaction fees',
  },
];

const REFERRAL_SOURCE = [
  {
    id: 'through-friends',
    name: 'Through friends',
  },
  {
    id: 'online-news-article',
    name: 'Saw a news article online',
  },
  {
    id: 'social',
    name: 'Social (Facebook, Instagram, Pinterest, etc)',
  },
  {
    id: 'search',
    name: 'Search (Google, Bing, etc)',
  },
  {
    id: 'neverland-rep',
    name: 'Contacted by a Neverland representative',
  },
  {
    id: 'other',
    name: 'Other',
  },
];

const TextAreaInput = styled.textarea`
  background-color: #F6F0E6;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border: 0px;
  border-bottom: 2px solid #1E1DCD !important;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  margin-top: 4px;
  margin-right: 16px;
  padding-right: 16px;
  margin-left: 16px;
  margin-right: 16px;
  font-size: 18px;
  width: 100%;
  padding: 16px;
  height: 100px;
  display: flex;
  flex-direction: column;
  &:focus {
    outline: none
  } 
`;

class SellerOnboardingBasicsPage extends Component {
  constructor(props) {
    super(props);
    // basics name
    // personal address
    // random info
    this.state = {
      fullNameError: '',
      emailError: '',
      phoneNumberError: '',
      passwordError: '',
      currIndex: 0,
      toNextStep: false,
      formData: {
        addressInput: {},
        stateSelectedItems: [],
      },
    };

    this.onChangeAddressInput = this.onChangeAddressInput.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onNextSection = this.onNextSection.bind(this);
    this.validateBasicInfo = this.validateBasicInfo.bind(this);
    this.validateAddressInfo = this.validateAddressInfo.bind(this);
    this.validateAdditionalInfo = this.validateAdditionalInfo.bind(this);
    this.onMultiSelectItemsChange = this.onMultiSelectItemsChange.bind(this);
    this.onChangePickerInput = this.onChangePickerInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeInputFinal = this.onChangeInputFinal.bind(this);
  }

  onSubmit() {
    //validate this last page
    this.props.onSubmitStep({ userId: this.props.currentUser._id, stepId: STEP_ID, formData: this.state.formData });
    this.props.setOnBoardingStepId(getNextOnBoardingStepId(this.props.onboardingStepId, true));
    this.setState({
      toNextStep: true
    });
  }

  onChangeAddressInput(addressState) {
    let newFormData = { ...this.state.formData };
    newFormData.addressInput = addressState;
    this.setState({
      formData: newFormData,
    });
  }

  onChangeInput(key, value) {
    let newFormData = { ...this.state.formData };
    newFormData[key] = value.target.value;
    this.setState({
      formData: newFormData,
    });
  }

  onNextSection() {
    if (this.state.currIndex === 0) {
      if (!this.validateBasicInfo()) {
        return false;
      }
    }
    if (this.state.currIndex === 1) {
      if (this.state.formData.addressInput && this.state.formData.addressInput.hasError) {
        return false;
      }
    }
    this.setState({
      currIndex: this.state.currIndex + 1,
    });
  }

  validateBasicInfo() {
    let fullNameData = this.state.formData.name;
    let phoneNumber = this.state.formData.phoneNumber;
    let isValid = true;
    if (
      fullNameData === undefined ||
      fullNameData === null ||
      fullNameData.length === 0 ||
      (this.state.namehasError && this.state.nameError && this.state.nameError.length > 0)
    ) {
      isValid = false;
      this.setState({
        nameError: 'Please enter a name.',
      });
    } else {
      this.setState({
        nameError: '',
      });
    }

    if (
      phoneNumber === null ||
      phoneNumber === undefined ||
      phoneNumber.length === 0 ||
      (this.state.phoneNumberError && this.state.phoneNumberError.length === 0)
    ) {
      isValid = false;
      this.setState({
        phoneNumberError: 'Please enter an password.',
      });
    } else {
      this.setState({
        phoneNumberError: '',
      });
    }
    return isValid;
  }

  validateAddressInfo() {
    if (this.state.formData.addressInput.hasError) {
      return false;
    }
  }

  /**
{

  formData: {
    fullName,
    email,
    phoneNumber,
    password,
    addressInput : {

    },
    sellerInterestReason,
    sellerReferralSource,
    sellerChallenge,
    stateSelectedItems,
    productSelectedItems,
    sellerStoreSelectedItems,
    sellerProductSource,
    sellerPacking
  }
}
  **/
  validateAdditionalInfo() {
    // seller interests
    let isValid = true;
    let sInterest = this.state.formData.sellerInterestReason;
    if (!sInterest || sInterest.length === 0) {
      this.setState({
        sellerInterestReasonError: 'Must select one answer.',
      });
      isValid = false;
    } else {
      this.setState({
        sellerInterestReasonError: '',
      });
    }

    // seller referral source
    let sReferral = this.state.formData.sellerReferralSource;
    if (!sReferral || sReferral.length === 0) {
      console.log('invlaid sellerReferralSource');
      this.setState({
        sellerReferralSourceError: 'Must select one.',
      });
      isValid = false;
    } else {
      this.setState({
        sellerReferralSourceError: '',
      });
    }

    // sellerChallenge
    let sChallenge = this.state.formData.sellerChallenge;
    if (!sChallenge || sChallenge.length < 30) {
      console.log('invlaid sChallenge');
      this.setState({
        sellerChallengeError: 'Please give us more details.',
      });
      isValid = false;
    } else {
      this.setState({
        sellerChallengeError: '',
      });
    }

    let sellerProducts = this.state.formData.productSelectedItems;
    if (!sellerProducts || sellerProducts.length === 0) {
      console.log('invlaid sellerProducts');
      this.setState({
        productSelectedItemsError: 'Please select products you sell.',
      });
      isValid = false;
    } else {
      this.setState({
        productSelectedItemsError: '',
      });
    }

    let sStoreItems = this.state.formData.sellerStoreSelectedItems;
    if (!sStoreItems || sStoreItems.length === 0) {
      console.log('invlaid sStoreItems');
      this.setState({
        sellerStoreSelectedItemsError: 'Please select existing platforms you sell on.',
      });
      isValid = false;
    } else {
      this.setState({
        sellerStoreSelectedItemsError: '',
      });
    }

    let sProductSource = this.state.formData.sellerProductSource;
    if (!sProductSource || sProductSource.length < 30) {
      console.log('invlaid sProductSource');
      this.setState({
        sellerProductSourceError: 'Please give us more details.',
      });
      isValid = false;
    } else {
      this.setState({
        sellerProductSourceError: '',
      });
    }

    let sPacking = this.state.formData.sellerPacking;
    if (!sPacking || sPacking.length < 30) {
      console.log('invlaid sPacking');
      this.setState({
        sellerPackingError: 'Please give us more details.',
      });
      isValid = false;
    } else {
      this.setState({
        sellerPackingError: '',
      });
    }
    return isValid;
  }

  onChangeInputFinal(key, inputState) {
    let newFormData = { ...this.state.formData };
    let error = inputState['error'];
    let stateKey = key + 'Error';
    if (error && error.length > 0) {
      this.setState({
        [stateKey]: error,
        [key + 'hasError']: inputState.hasError,
      });
    } else {
      newFormData[key] = inputState[key];
      this.setState(
        {
          formData: newFormData,
          [key + 'hasError']: inputState.hasError,
        },
        () => {},
      );
    }
  }

  renderBasicInfoSection() {
    if (this.state.currIndex !== 0) {
      return null;
    }
    let nameInputStyle = this.state.fullNameError.length == 0 ? BrandStyles.components.input : BrandStyles.components.errorInput;
    let phoneNumberInputStyle = this.state.phoneNumberError.length == 0 ? BrandStyles.components.input : BrandStyles.components.errorInput;
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <NameInput onChange={this.onChangeInputFinal} error={this.state.nameError} />
        <PhoneNumberInput onChange={this.onChangeInputFinal} error={this.state.phoneNumberError} />
        <div>
          <NButton onClick={this.onNextSection} title={'Next'} />
        </div>
      </div>
    );
  }

  renderBasicAddressSection() {
    if (this.state.currIndex !== 1) {
      return null;
    }

    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <h2>Your home address</h2>
          <p>We will send you a welcome gift as well as any business documents you need.</p>
        </div>
        <p>{this.state.addressError}</p>
        <AddressInput onChange={this.onChangeAddressInput} theme={'light'} />
        <div style={{marginTop: 32}}>
          <NButton style={{margin: 'auto'}} onClick={this.onNextSection} title="Next" />
        </div>
      </div>
    );
  }

  onChangePickerInput(key, value) {
    let newFormData = { ...this.state.formData };
    newFormData[key] = value;

    this.setState({
      formData: newFormData,
    });
  }

  onMultiSelectItemsChange(key, values) {
    let newFormData = { ...this.state.formData };
    newFormData[key] = values;

    this.setState({
      formData: newFormData,
    });
  }

  renderAdditionalInfoSection() {
    if (this.state.toNextStep) {
      return (<Redirect to="/seller/onboarding/shop" />);
    }
    if (this.state.currIndex !== 2) {
      return null;
    }

    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <h2>Additional Questions</h2>
          <p>
            Please tell us more information about your store so we can make sure you're set up for
            success with customers.
          </p>
        </div>
        <form>
          <div style={{ height: 24 }} />
          <span style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            Why are you interested in Neverland?
          </span>
          <NSelect
            items={WHY_SIGNUP_NVLND}
            isSingleSelect={true}
            itemIdKey="id"
            itemTitleKey="name"
            hideSelectedTags={true}
            placeholderText={'Select interest'}
            onChangeItems={(values) => {
              this.onMultiSelectItemsChange('sellerInterestReason', values);
            }}
          />
          <span>{this.state.sellerInterestReasonError}</span>
          <div>
            <div style={{ height: 24 }} />
            <span style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
              {' '}
              How did you hear about Neverland?
            </span>
            <NSelect
              items={REFERRAL_SOURCE}
              isSingleSelect={true}
              itemIdKey="id"
              itemTitleKey="name"
              hideSelectedTags={true}
              placeholderText={'Select source'}
              onChangeItems={(values) => {
                this.onMultiSelectItemsChange('sellerReferralSource', values);
              }}
            />
          </div>
          <span>{this.state.sellerReferralSourceError}</span>
          <div style={{ height: 24 }} />
          <span style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            {' '}
            What are your biggest challenges as a business?
          </span>
          <div style={{marginRight: 32}}>
            <TextAreaInput
              multiline={true}
              onChange={(value) => {
                this.onChangeInput('sellerChallenge', value);
              }}
              placeholder="Tell us about a challenge.."
            />
          </div>
          <span>{this.state.sellerChallengeError}</span>
          <div style={{ height: 24 }} />
          <span style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            Are there states within the USA that you cannot ship to? If so, please list those
            states.
          </span>
          <div style={{ flex: 1, borderRadius: 16 }}>
            <NSelect
              items={stateData.default}
              itemIdKey="abbreviation"
              itemTitleKey="name"
              placeholderText={'Select states...'}
              onChangeItems={(values) => {
                this.onMultiSelectItemsChange('stateSelectedItems', values);
              }}
            />
          </div>
          <div style={{ height: 24 }} />
          <span style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            {' '}
            What products do you currently sell?{' '}
          </span>
          <NSelect
            items={sellerProductData.default}
            itemIdKey="id"
            itemTitleKey="name"
            placeholderText={'Select products...'}
            onChangeItems={(values) => {
              this.onMultiSelectItemsChange('productSelectedItems', values);
            }}
          />
          <span>{this.state.productSelectedItemsError}</span>
          <div style={{ height: 24 }} />
          <span style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            Where do you currently sell?{' '}
          </span>
          <NSelect
            items={sellerStores.default}
            itemIdKey="id"
            itemTitleKey="name"
            placeholderText={'Select places...'}
            onChangeItems={(values) => {
              this.onMultiSelectItemsChange('sellerStoreSelectedItems', values);
            }}
          />

          <span>{this.state.sellerStoreSelectedItemsError}</span>
          <span style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            Where do you source products from?
          </span>
          <TextAreaInput
            //style={[BrandStyles.components.inputBase.container, { minHeight: 100 }]}
            multiline={true}
            onChange={(value) => {
              this.onChangeInput('sellerProductSource', value);
            }}
            placeholder="Tell us where you source your products.."
          />
          <span>{this.state.sellerProductSourceError}</span>
          <span style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            How do you pack products now for shipping? (if applicable)
          </span>
          <TextAreaInput
            //style={[BrandStyles.components.inputBase.container, { minHeight: 100 }]}
            multiline={true}
            onChange={(value) => {
              this.onChangeInput('sellerPacking', value);
            }}
            placeholder="Tell us how you pack products for shipping (if applicable).."
          />
          <span>{this.state.sellerPackingError}</span>
        </form>
        <div style={{marginTop: 32}}>
          <NButton style={{margin: 'auto'}} onClick={this.onSubmit} title="Submit" />
        </div>
        <div style={{ height: 84 }} />
      </div>
    );
  };

  render() {
    let containerStyle = {...BrandStyles.components.onboarding.container, alignItems: 'center', flexDirection: 'column'};
    return (
      <OnboardingImageWrapper>
        <OnboardingHeader onPressBack={this.props.onPressBack} />
        <div style={containerStyle}>
          <div style={{ height: 64 }} />
            <p
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                textAlign: 'center',
                padding: 16,
              }}
            >
              Basics
            </p>
            <div style={{maxWidth: 800, justifyContent: 'center'}}>
              {this.renderBasicInfoSection()}
              {this.renderBasicAddressSection()}
              {this.renderAdditionalInfoSection()}
            </div>
            <div style={{ height: 64 }} />
            {/*<View>
              <TouchableHighlight onPress={this.props.onSignOut}>
                <Text style={{ textAlign: 'center' }}>Logout</Text>
              </TouchableHighlight>
            </View>*/}
        </div>
      </OnboardingImageWrapper>
    );
  }

}

const mapStateToProps = state => {
  return {
    currentUser: state.auth
  }
}

export default connect(mapStateToProps, { onSubmitStep, setOnBoardingStepId })(SellerOnboardingBasicsPage);