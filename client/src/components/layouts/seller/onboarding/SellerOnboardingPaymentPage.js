import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sellerOnBoardingSteps } from '../../../../constants/onBoardingSteps';
import BrandStyles from '../../../BrandStyles';
import NButton from '../../../UI/NButton';
import OnboardingImageWrapper from './OnboardingImageWrapper';
import OnboardingHeader from './OnboardingHeader';
import SellerLoadingPage from './SellerLoadingPage';
import { setOnBoardingStepId, logoutFirebase } from "../../../../actions/auth";
import { getSellerAccountLinks } from '../../../../actions/seller';

const STEP_ID = sellerOnBoardingSteps.SIGNUP_PAYMENT;

class SellerOnboardingPaymentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingLinks: false
    }
    this.onPressStripePaymentFlow = this.onPressStripePaymentFlow.bind(this);
  }
  componentDidMount() {
    this.setState({ isLoadingLinks: true }, this.onRetrieveAccountLinksFinish);
    if (
      !this.props.accountLinks ||
      Object.keys(this.props.accountLinks).length == 0 ||
      this.state.isLoadingLinks
    ) {
      this.setState({ isLoadingLinks: true }, this.onRetrieveAccountLinksFinish);
    }
  }

  onRetrieveAccountLinksFinish = async () => {
    await this.props.getSellerAccountLinks({ sellerId: this.props.user._id });
    this.setState({ isLoadingLinks: false });
  };


  onPressStripePaymentFlow() {
    // open up a url in web browser
    window.open(this.props.accountLinks.url)
  }

  render() {
    if (
      !this.props.accountLinks ||
      Object.keys(this.props.accountLinks).length == 0 ||
      this.state.isLoadingLinks
    ) {
      return (<SellerLoadingPage />);
    }
    let containerStyle = {...BrandStyles.components.onboarding.container, paddingTop: 44, alignItems: 'center', flexDirection: 'column'};
    return (
      <OnboardingImageWrapper>
        <OnboardingHeader />
        <div style={containerStyle}>
          <h2 style={{ fontWeight: 'bold' }}>Get Paid</h2>
          <div style={{ height: 16 }} />
          <span>
            We integrate with Stripe to manage your payouts. Please clik on the button below to set
            up all of your information.
          </span>
          <div style={{ height: 16 }} />
          <NButton onClick={this.onPressStripePaymentFlow} title="Fill out payment info" />
          {/*<Button onPress={this.props.logOut} title="logout"></Button>*/}
        </div>
      </OnboardingImageWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth,
  accountLinks: state.seller.accountLinks,
});

const actions = {
  logOut: logoutFirebase,
  getSellerAccountLinks,
};

export default connect(mapStateToProps, actions)(SellerOnboardingPaymentPage);
