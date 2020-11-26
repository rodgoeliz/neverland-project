import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
import { sellerOnBoardingSteps } from '../../../../constants/onBoardingSteps';
import { checkSellerPaymentOnBoardingStatus, clearAccountLinks } from '../../../../actions/seller';
import { setOnBoardingStepId } from '../../../../actions/auth';
import { getNextOnBoardingStepId } from '../../../../utils/helpers';
import screenNames from '../../../../constants/screenNames';
import SellerLoadingPage from './SellerLoadingPage';
import BrandStyles from '../../../BrandStyles';

class SellerOnboardingPaymentRoutingRoomPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toActivationPendingPage: false
    }
  }

  async componentDidMount() {
    console.log("Seller onboarding routing room", this.props)

    const accountId = this.props.match.params.accountId;
    await this.props.getAccountInfo({ accountId });
    this.props.clearAccountLinks();
    this.props.setOnBoardingStepId(getNextOnBoardingStepId(this.props.onboardingStepId, true));
    this.setState({
      toActivationPendingPage: true
    });
  }

  onSubmitForm() {}

  render() {
    if (this.state.toActivationPendingPage) {
      return (<Redirect to="/seller/onboarding/activation-pending" />);
    }
    return (<SellerLoadingPage />);
  }
}

const mapStateToProps = (state) => ({
  onboardingStepId: state.auth.onboardingStepId,
});

const actions = {
  getAccountInfo: checkSellerPaymentOnBoardingStatus,
  setOnBoardingStepId: setOnBoardingStepId,
  clearAccountLinks: clearAccountLinks,
};

export default connect(mapStateToProps, actions)(SellerOnboardingPaymentRoutingRoomPage);
