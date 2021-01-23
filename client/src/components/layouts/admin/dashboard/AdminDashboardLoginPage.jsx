import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import NButton from 'components/UI/NButton';
import BrandStyles from 'components/BrandStyles';
import PasswordInput from 'components/UI/PasswordInput';
import EmailInput from 'components/UI/EmailInput';

import { loginFirebase } from 'actions/auth';

import OnboardingImageWrapper from 'components/layouts/seller/onboarding/OnboardingImageWrapper';
import OnboardingHeader from 'components/layouts/seller/onboarding/OnboardingHeader';

const styles = {
  container: {
    backgroundColor: BrandStyles.color.beige,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  errorMessage: {
    color: BrandStyles.color.maroon,
    fontSize: 12,
    paddingLeft: 16,
    paddingTop: 4,
  },
};

class AdminDashboardLoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
      isSellerOnboarding: true,
      loginErrorCode: "",
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
    if (this.props.auth.isProfileComplete && this.props.auth.isActive) {
      this.setState({
        nextPath: '/seller/dashboard/products'
      });
      return;
    }
    this.setState({
      nextPath: '/seller/onboarding/products',
    });
    // redirect to main routing which will then redirect to the right step
  }

  async onSubmitForm() {
    if (this.validateInput()) {
      this.setState({ isSubmitting: true });
      const data = this.state;
      try {
        // transform data
        const transformedData = {
          email: data.email.email,
          password: data.password.password,
          isSellerOnboarding: this.state.isSellerOnboarding,
        };
        const response = await this.props.loginFirebase(transformedData, 'default');
        if (!response.success) {
          this.setState({ isSubmitting: false, loginErrorCode: response.data }, () => {
          });
        } else {
          let nextPath = '/admin/dashboard/products';
          if (this.props && this.props.location && this.props.location.state) {
            nextPath = this.props.location.state.from;
          }
          this.setState({ nextPath, isSubmitting: false });
          this.redirectToNextStep();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  hasError(key) {
    const errorCode = this.state.loginErrorCode;

    if (key === 'email' && (errorCode === 'auth/invalid-email' || errorCode === 'auth/user-not-found')) {
      return true;
    }
    if (key === 'password' && errorCode === 'auth/wrong-password') {
      return true;
    }

    return (
      key === 'other' &&
      (errorCode === 'auth/user-not-found' || errorCode === 'auth/too-many-requests')
    );
  }

  renderErrorCode() {
    const errorCode = this.state.loginErrorCode;
    let error = '';
    switch (errorCode) {
      case 'auth/invalid-email':
        error = 'The provided email address is invalid.';
        break;
      case 'auth/wrong-password':
        error = 'The password is incorrect';
        break;
      case 'auth/user-not-found':
        error = 'This email does not exist.';
        break;
      case 'auth/too-many-requests':
        error = 'Too many login attempts. Please try again in a few minutes.';
        break;
      default:
        error = 'Something went wrong. Please check the data you entered and try again.';
        break;
    }
    return error;
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
      return (<Redirect to="/seller/onboarding/basics" />);
    }

    const containerStyle = {...BrandStyles.components.onboarding.container, flexDirection: 'column'};

    let emailErrorMsg = this.state.emailError;
    let passErrorMsg = this.state.passwordError;
    const emailError = this.hasError('email');
    if (emailError) {
      emailErrorMsg = this.renderErrorCode()
    }
    const passError = this.hasError('password');
    if (passError) {
      passErrorMsg = this.renderErrorCode();
    }
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
              <EmailInput onChange={this.onChangeInput.bind(this)} error={emailErrorMsg} />
              <div style={{height: 8}} />
              <PasswordInput
                onChange={this.onChangeInput.bind(this)}
                error={passErrorMsg}
              />
              <div style={{height: 8}} />
              <div>
                <NButton
                  buttonStyle={{
                    justifyContent: 'center',
                  }}
                  isLoading={this.state.isSubmitting}
                  title="Login"
                  onClick={() => {
                    console.log("ON LICK")
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

export default connect(mapStateToProps, { loginFirebase })(AdminDashboardLoginPage);
