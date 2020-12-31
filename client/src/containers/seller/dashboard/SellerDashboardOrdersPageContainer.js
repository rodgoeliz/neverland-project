import React from 'react';
import { connect } from 'react-redux';

import Layout from 'components/layouts/seller/dashboard/SellerDashboardOrdersPage';
import { getSellerOrders, getAlgoliaSearchClient } from 'actions';
            
class SellerDashboardProductsPageContainer extends React.Component {

    constructor(props) {
      super(props);
      this.state ={
        currentPage: 0
      };
    }

    componentDidMount() {
        // For every update just fetch data for get seller products
        this.props.getSellerOrders(this.props.auth._id);
    }

    changePage = (event, value) => {
        // -1 for start with 0 page.
        this.setState({
          currentPage: value - 1
        });
    }

    render() {
      console.log("algolia search", getAlgoliaSearchClient())
        return (
          <Layout 
            searchClient={getAlgoliaSearchClient()}
            indexName="neverland_order_test"
            changePage={this.changePage.bind(this)}
            sellerOrders={this.props.seller.ordersCache}
            currentPage={this.state.currentPage}
          />
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    seller: state.seller
});

export default connect(mapStateToProps, { getSellerOrders, getAlgoliaSearchClient })( SellerDashboardProductsPageContainer );
