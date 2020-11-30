import React, { Component } from 'react';
import { connect } from 'react-redux';

import { sellerOnBoardingSteps } from '../../../../constants/onBoardingSteps';
import BrandStyles from '../../../BrandStyles';

import OnboardingImageWrapper from './OnboardingImageWrapper';
import OnboardingHeader from './OnboardingHeader';

const STEP_ID = sellerOnBoardingSteps.SIGNUP_ADD_PRODUCTS;

class SellerLoadingPage extends Component {
  constructor(props) {
    super(props);
  }

  onPressBack() {

  }

  render() {
    let viewStyle = {...BrandStyles.components.onboarding.container, paddingTop: 44, alignItems: 'center', flexDirection: 'column'};
    return (
      <OnboardingImageWrapper>
        <OnboardingHeader hideBackButton />
        <div style={viewStyle}>
          {/* Add products */}
          {/* Create a list of preview of products that are added and an add to list at the end */}
          <div style={{ marginTop: 32, marginBottom: 32, maxWidth: 350 }}>
            <span>
              Loading your next onboarding step...
            </span>
          </div>
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

export default connect(mapStateToProps, { })(SellerLoadingPage);