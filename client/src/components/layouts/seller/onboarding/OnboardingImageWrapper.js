import React, { Component } from 'react';

export default class OnboardingImageWrapper extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        style={styles.container}
      >
        {this.props.children}
      </div>
    );
  }
}

const styles = {
  container: {
    width: '100%',
    height: '90%',
    zIndex: -100,
    position: 'absolute',
    backgroundImage: "url('../../../../images/onboarding-background.png')",
    backgroundSize: 'cover'
  },
};
