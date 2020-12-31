import React from 'react';
import { connect } from 'react-redux';

import BrandStyles from 'components/BrandStyles';

function SellerDashboardLoadingPage() {
  const viewStyle = {
    ...BrandStyles.components.onboarding.container,
    paddingTop: 44,
    alignItems: 'center',
    flexDirection: 'column',
  };
  return (
    <div style={{width: '100%', height: '100%'}}>
    <div style={viewStyle}>
      {/* Add products */}
      {/* Create a list of preview of products that are added and an add to list at the end */}
      <div style={{ marginTop: 32, marginBottom: 32, maxWidth: 350 }}>
        <span>Loading your dashboard...</span>
      </div>
    </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  currentUser: state.auth,
});

export default connect(mapStateToProps, {})(SellerDashboardLoadingPage);
