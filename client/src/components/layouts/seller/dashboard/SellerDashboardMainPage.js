import React from 'react';
import { connect } from 'react-redux';

import { loginFirebase } from 'actions/auth';

import SellerDashboardNavWrapper from './SellerDashboardNavWrapper';

function SellerDashboardMainPage() {
  return (
    <SellerDashboardNavWrapper>
      <div>MAIN DASHOARD PAGE</div>
    </SellerDashboardNavWrapper>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { loginFirebase })(SellerDashboardMainPage);
