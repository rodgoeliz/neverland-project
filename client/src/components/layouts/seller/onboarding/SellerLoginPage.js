import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import NButton from 'components/UI/NButton';
import BrandStyles from 'components/BrandStyles';
import PasswordInput from 'components/UI/PasswordInput';
import EmailInput from 'components/UI/EmailInput';

import { loginFirebase } from 'actions/auth';

import OnboardingImageWrapper from './OnboardingImageWrapper';
import OnboardingHeader from './OnboardingHeader';

const styles = {
  container: {
    backgroundColor: BrandStyles.color.beige,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
};

class SellerLoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
      toNextStep: false,
    };
  }

  onChangeInput(key, value) {
    this.setState({
      [key]: value,
    });
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validateInput() {
    let isValid = true;
    if (this.state.email === '') {
      console.log('email is empty');
      this.setState({
        emailError: 'Please enter a valid e-mail.',
      });
      isValid = false;
    } else {
      isValid = !this.state.email.hasError;
      if (isValid) {
        this.setState({
          emailError: '',
        });
      }
    }

    if (this.state.password === '') {
      this.setState({
        passwordError: 'Please enter a password.',
      });
      isValid = false;
    } else {
      isValid = !this.state.password.hasError;
      if (isValid) {
        this.setState({
          passwordError: '',
        });
      }
    }

    return isValid;
  }

  redirectToNextStep() {
    this.setState({
      nextPath: '/seller/onboarding/main',
    });
    // redirect to main routing which will then redirect to the right step
  }

  async onSubmitForm() {
    if (this.validateInput()) {
      try {
        let nextPath = '/seller/onboarding/main';
        if (this.props && this.props.location && this.props.location.state) {
          nextPath = this.props.location.state.from;
        }
        this.setState({ nextPath });
        this.redirectToNextStep();
      } catch (error) {
        console.log(error);
      }
    }
  }

  renderError(error) {
    if (error.length < 1) {
      return null;
    }

    return <span style={BrandStyles.components.errorMessage}>{error}</span>;
  }

  renderFacebookErrorCode() {
    const errorCode = this.props.fbError;
    let message = '';
    switch (errorCode) {
      case 'auth/user-not-found':
        message = "We couldn't find account associated with this FB account.";
        break;
      case 'auth/facebook-login-failed':
        message = "We couldn't get your account details. Please try again later.";
        break;
      default:
        break;
    }

    return <span style={styles.errorMessage}>{message}</span>;
  }

  render() {
    if (this.state.nextPath) {
      return <Redirect to={this.state.nextPath} />;
    }
    if (this.state.toNextStep) {
      return <Redirect to="/seller/onboarding/basics" />;
    }
    const containerStyle = { ...BrandStyles.components.onboarding.container, flexDirection: 'column' };
    return (
      <OnboardingImageWrapper>
        <OnboardingHeader />
        <div>
          <div style={containerStyle}>
            <div style={{ height: 64 }} />
            <span
              style={{
                color: BrandStyles.color.blue,
                fontSize: 12,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              LET'S GET STARTED
            </span>
            <span
              style={{
                color: BrandStyles.color.black,
                fontSize: 32,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              LOGIN
            </span>
            <div style={{ height: 32 }} />
            <form style={{ justifyContent: 'center' }}>
              <EmailInput onChange={this.onChangeInput.bind(this)} error={this.state.emailError} />
              <div style={{ height: 8 }} />
              <PasswordInput onChange={this.onChangeInput.bind(this)} error={this.state.passwordError} />
              <div style={{ height: 8 }} />
              <div>
                <NButton
                  buttonStyle={{
                    justifyContent: 'center',
                  }}
                  isLoading={this.props.isLoadingSubmitSignup}
                  title="Login"
                  onClick={() => {
                    this.onSubmitForm();
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      </OnboardingImageWrapper>
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { loginFirebase })(SellerLoginPage);
