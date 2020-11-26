import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getSellerAccountLinks, clearAccountLinks } from '../../../../actions/seller';
import { getNextOnBoardingStepId } from "../../../../utils/helpers";
import { sellerOnBoardingStepsToPath, sellerOnBoardingSteps } from '../../../../constants/onBoardingSteps'
import SellerLoadingPage from './SellerLoadingPage';
import BrandStyles from '../../../BrandStyles';

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

    // else take user to their onboarding step if profile isn't activated
    let stepId = this.props.user.onboardingStepId;
    let nextPath = sellerOnBoardingStepsToPath[stepId];
    this.setState({
      nextPath
    });
  }

  onSubmitForm() {}

  render() {
    if (this.state.nextPath) {
      return (<Redirect to={this.state.nextPath} />);
    }
    if (this.state.isLoading) {
      console.log("SELLER LOADING PAGE")
      return (<SellerLoadingPage />);
    }
  }
}

const mapStateToProps = (state) => ({
  user: state.auth
});

const actions = {
  clearAccountLinks: clearAccountLinks,
  getSellerAccountLinks: getSellerAccountLinks,
};

export default connect(mapStateToProps, actions)(SellerOnboardingMainRoutingPage);
