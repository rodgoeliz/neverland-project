import React from 'react';

import { connect } from 'react-redux';

import Layout from 'components/layouts/seller/dashboard/SellerDashboardPaymentsPage';

import { getAlgoliaSearchClient, getAlgoliaSellerOrderIndex } from 'actions';

class SellerDashboardPaymentsPageContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      hello: ""
    }
    console.log(this.state)
  }

  componentDidMount() {
    // For every update just fetch data for get seller products
    // fetch data for orders that were paid out
    // get total amount and the amount that is pending
    // this.props.getSellerPayments(this.props.auth._id);
  }


  render() {
    return (
      <Layout 
        searchClient={getAlgoliaSearchClient()}
        indexName={getAlgoliaSellerOrderIndex()}
      />
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  seller: state.seller
});

export default connect(mapStateToProps, { getAlgoliaSearchClient, getAlgoliaSellerOrderIndex })(SellerDashboardPaymentsPageContainer);
