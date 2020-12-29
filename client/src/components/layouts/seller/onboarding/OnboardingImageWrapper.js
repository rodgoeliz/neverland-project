import React from 'react';

export default function OnboardingImageWrapper({ children }) {
  const styles = {
    container: {
      width: '100%',
      height: '90%',
      zIndex: -100,
      position: 'absolute',
      backgroundImage: "url('../../../../images/onboarding-background.png')",
      backgroundSize: 'cover',
    },
  };
  return <div style={styles.container}>{children}</div>;
}
