import React from 'react';

import { connect } from 'react-redux';

import Layout from 'components/layouts/seller/dashboard/SellerDashboardPaymentsPage';

import { getAlgoliaSearchClient, getAlgoliaSellerOrderIndex } from 'actions';

function SellerDashboardPaymentsPageContainer({ auth }) {
    return (
      <Layout 
        searchClient={getAlgoliaSearchClient()}
        indexName={getAlgoliaSellerOrderIndex()}
        sellerId={auth._id}
      />
    );
}

const mapStateToProps = state => ({
  auth: state.auth,
  seller: state.seller
});

export default connect(mapStateToProps, { getAlgoliaSearchClient, getAlgoliaSellerOrderIndex })(SellerDashboardPaymentsPageContainer);
