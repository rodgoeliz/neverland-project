import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';

const styles = {
  container: {
    display: "flex",
    minHeight: "12rem",
    "flexDirection": 'row',
    "alignItems": 'center',
    "justifyContent": 'center',
  },
  backButtonContainer: {
    paddingLeft: "1rem",
  },
  backButtonIcon: {
    fontSize: "4rem",
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    display: 'flex'
  },
  logo: {
    margin: 'auto',
    maxHeight: '10vh'
  },
};
class OnboardingHeader extends React.Component {

  constructor(props) {
    super(props);
    this.onPressBackButton = this.onPressBackButton.bind(this);
  }

  onPressBackButton() {
    console.log("onpressback", this.props.history)
  }

  render() {
    const hideBackButton = this.props.hideBackButton;
    const onPressBack = this.props.onPressBack;  
    console.log(this.props.onClickBackButton)
    return (
      <div style={styles.container}>
        <div style={styles.logoContainer}>
          <img
            src="../../../../images/neverland_logo.png"
            style={styles.logo}
            resizeMode={'contain'}
          />
        </div>
      </div>
    );
  }
}

export default OnboardingHeader;
