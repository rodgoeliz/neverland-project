import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { sellerOnBoardingStepsToPath, sellerOnBoardingSteps } from 'constants/onBoardingSteps';

import BrandStyles from 'components/BrandStyles';

import { logoutFirebase } from 'actions/auth';

import NButton from 'components/UI/NButton';
import NClickableText from 'components/UI/NClickableText';

const styles = {
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    display: 'flex',
  },
  logo: {
    margin: 'auto',
    maxHeight: '10vh',
  },
};
class SellerOnboardingAuthPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: '',
    };

    this.onClickSignup = this.onClickSignup.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
  }

  async componentDidMount() {
    // clear our entire state
    // get user onboardingStepID and reroute to the right step OR take them to
    // sign up or login page
  }

  onSubmitForm() {}

  onClickSignup() {
    this.setState({
      redirectTo: sellerOnBoardingStepsToPath[sellerOnBoardingSteps.SIGNUP_START],
    });
  }

  onClickLogin() {
    this.setState({
      redirectTo: sellerOnBoardingStepsToPath[sellerOnBoardingSteps.LOGIN_START],
    });
  }

  render() {
    if (this.state.redirectTo) {
      let fromPath = '';
      if (this.props && this.props.location && this.props.location.state) {
        fromPath = this.props.location.state.from;
      }

      return (
        <Redirect
          to={{
            pathname: this.state.redirectTo,
            state: { from: fromPath },
          }}
        />
      );
    }
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            margin: 'auto',
            textAlign: 'center',
            backgroundColor: BrandStyles.color.beige,
          }}
        >
          <div style={styles.logoContainer}>
            <img src="../../../../images/neverland_logo.png" style={styles.logo} resizeMode="contain" />
          </div>
          <span>Join our seller community.</span>
          <br />
          <br />
          <br />
          <NButton onClick={this.onClickSignup} buttonStyle={{ maxWidth: 400, margin: 'auto' }} title="Signup" />
          <NClickableText title="Login" onClick={this.onClickLogin} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth,
});

const actions = {
  logoutFirebase,
};

export default connect(mapStateToProps, actions)(SellerOnboardingAuthPage);
