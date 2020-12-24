import React from 'react';

const styles = {
  container: {
    display: 'flex',
    minHeight: '12rem',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonContainer: {
    paddingLeft: '1rem',
  },
  backButtonIcon: {
    fontSize: '4rem',
  },
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
class OnboardingHeader extends React.Component {
  constructor(props) {
    super(props);
    this.onPressBackButton = this.onPressBackButton.bind(this);
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.logoContainer}>
          <img src="../../../../images/neverland_logo.png" style={styles.logo} resizeMode="contain" />
        </div>
      </div>
    );
  }
}

export default OnboardingHeader;
