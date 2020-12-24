import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { getNextOnBoardingStepId } from 'utils/helpers';

import { setOnBoardingStepId } from 'actions/auth';
import { checkSellerPaymentOnBoardingStatus, clearAccountLinks } from 'actions/seller';

import SellerLoadingPage from './SellerLoadingPage';

class SellerOnboardingPaymentRoutingRoomPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toActivationPendingPage: false,
    };
  }

  async componentDidMount() {
    const { accountId } = this.props.match.params;
    await this.props.getAccountInfo({ accountId });
    this.props.clearAccountLinks();
    this.props.setOnBoardingStepId(getNextOnBoardingStepId(this.props.onboardingStepId, true));
    this.setState({
      toActivationPendingPage: true,
    });
  }

  onSubmitForm() {}

  render() {
    if (this.state.toActivationPendingPage) {
      return <Redirect to="/seller/onboarding/activation-pending" />;
    }
    return <SellerLoadingPage />;
  }
}

const mapStateToProps = (state) => ({
  onboardingStepId: state.auth.onboardingStepId,
});

const actions = {
  getAccountInfo: checkSellerPaymentOnBoardingStatus,
  setOnBoardingStepId,
  clearAccountLinks,
};

export default connect(mapStateToProps, actions)(SellerOnboardingPaymentRoutingRoomPage);
