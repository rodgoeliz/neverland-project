import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { sellerOnBoardingStepsToPath, sellerOnBoardingSteps } from 'constants/onBoardingSteps'

import { getSellerAccountLinks, clearAccountLinks } from 'actions/seller';


import SellerLoadingPage from './SellerLoadingPage';

class SellerOnboardingMainRoutingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      nextPath: ""
    };
  }

  async componentDidMount() {
    if (!this.props.user) {
      // take user to login or sign up page if they aren't authenticated
      this.setState({
        nextPath: sellerOnBoardingStepsToPath[sellerOnBoardingSteps.MAIN_AUTH]
      });
      return;
    }

    if (this.props.user.isActivated && this.props.user.isSeller) {
      this.sestState({
        nextPath: '/seller/dashboard/orders'
      });
      return;
    }

    // else take user to their onboarding step if profile isn't activated
    const stepId = this.props.user.onboardingStepId;
    const nextPath = sellerOnBoardingStepsToPath[stepId];
    this.setState({
      nextPath
    });
  }

  onSubmitForm() { }

  render() {
    if (this.state.nextPath) {
      return (<Redirect to={this.state.nextPath} />);
    }
    if (this.state.isLoading) {
      return (<SellerLoadingPage />);
    }
  }
}

const mapStateToProps = (state) => ({
  user: state.auth
});

const actions = {
  clearAccountLinks,
  getSellerAccountLinks,
};

export default connect(mapStateToProps, actions)(SellerOnboardingMainRoutingPage);
