import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styled from "styled-components";

import {FormLabel, FormControl, FormGroup, FormControlLabel, Checkbox} from "@material-ui/core";

import { getNextOnBoardingStepId } from 'utils/helpers';

import { setOnBoardingStepId } from 'actions/auth';
import { updateShippingPreference } from 'actions/store';

import BrandStyles from 'components/BrandStyles';
import NButton from 'components/UI/NButton';
import extractId from 'utils/extractId';

import OnboardingImageWrapper from './OnboardingImageWrapper';
import OnboardingHeader from './OnboardingHeader';

const ContentContainer = styled.div`
  margin-top: 32px;
  margin-bottom: 32px;
  max-width: 350px;
`;

const FormContainer = styled.div`
`;
class SelelrOnboardingShippingProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        shippingPreference: 'neverland-shippo',
        toNextStep: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      shippingPreference: event.target.name
    }, () => {
      console.log("SHIPP PREF: ", this.state)
    });
  }

  async onSubmit() {
    const success = await this.props.updateShippingPreference(extractId(this.props.auth.storeId), this.state.shippingPreference);
    if (!success) {
      return;
    }
    this.props.setOnBoardingStepId(getNextOnBoardingStepId(this.props.onboardingStepId, true));
    this.setState({
      toNextStep: true,
    });

  }

  render() {
    if (this.state.toNextStep) {
      return <Redirect to="/seller/onboarding/products" />;
    }
    const containerStyle = {
      ...BrandStyles.components.onboarding.container,
      alignItems: 'center',
      flexDirection: 'column',
      paddingTop: 32
    };
    return (
    <OnboardingImageWrapper>
      <OnboardingHeader hideBackButton />
        <div style={containerStyle}>
          <h1 style={{ fontWeight: 'bold' }}> Shipping Preferences </h1>
          <span style={{maxWidth: 350, textAlign: 'center'}}>
            Please indicate how you'd like to ship with Neverland with the options below.
            Please <b>READ CAREFULY</b>.
          </span>
          <ContentContainer>
          <FormContainer>
            <FormControl required component="fieldset">
              <FormLabel component="legend">Pick one </FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={this.state.shippingPreference === "neverland-shippo"} onChange={this.handleChange} name="neverland-shippo"/>}
                  label="Neverland Shipping (through Shippo)"
                /> 
                <span> Neverland will handle generating shipping labels for priority shipping on your behalf through Shippo.
                You will be able to specify per-product if your buyer pays for shipping or whether you'd like to offer the shipping free for a product. If you offer the shipping for free, the shipping cost for the label will be subtracted from the order.</span>
                <FormControlLabel
                  control={<Checkbox checked={this.state.shippingPreference === "manual"} onChange={this.handleChange} name="manual"/>}
                  label="Manual (provide your own tracking)"
                />
                <span> 
                  You are responsible for manually entering the tracking information for each order. This must happen in order to register an order to be paid out. 
                  For this option, you must integrate the cost of shipping into your product price and all of your products will be marked as "Free Shipping". 
                  In general, offering free shipping and incorporating the cost into your product price is recommended and has shown to result in more orders.
                </span>
              </FormGroup>
            </FormControl>
          </FormContainer>
          <div style={{ marginTop: 32 }}>
            <NButton style={{ margin: 'auto' }} onClick={this.onSubmit} title="Next Step" />
          </div>
          </ContentContainer>
        </div>
    </OnboardingImageWrapper>);
  }
}

const mapStateToProps = (state) => ({
  onboardingStepId: state.auth.onboardingStepId,
  auth: state.auth
});

const actions = {
  updateShippingPreference,
  setOnBoardingStepId
};

export default connect(mapStateToProps, actions)(SelelrOnboardingShippingProfilePage);
