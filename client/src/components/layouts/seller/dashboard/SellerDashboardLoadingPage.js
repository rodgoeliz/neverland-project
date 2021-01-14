import React from 'react';
import { connect } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';
import styled from "styled-components";

import SellerDashboardNavWrapper from './SellerDashboardNavWrapper';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 32px;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 60vw;
`;

function SellerDashboardLoadingPage() {
  return (
    <SellerDashboardNavWrapper>
        <LoadingContainer>
          <ClipLoader />
          <span>Loading your dashboard...</span>
        </LoadingContainer>
    </SellerDashboardNavWrapper>
  );
}

const mapStateToProps = (state) => ({
  currentUser: state.auth,
});

export default connect(mapStateToProps, {})(SellerDashboardLoadingPage);
