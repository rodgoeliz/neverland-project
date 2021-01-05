import React from 'react';
import { connect } from 'react-redux';

import Layout from 'components/layouts/seller/dashboard/SellerDashboardProductsPage';
import { getSellerOrders, getAlgoliaSearchClient, getAlgoliaSellerProductIndex } from 'actions';
            
class SellerDashboardProductsPageContainer extends React.Component {

    constructor(props) {
      super(props);
      this.state ={
        currentPage: 0,
        hitsPerPage : 10
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
      console.log(this.props.seller.productsCache)
      const filterQuery = `vendorId:${this.props.auth._id}`;
      // TEST QUERY: const filterQuery = `vendorId:5fc43c800147f800176841a3`;
        return (
          <Layout 
            searchClient={getAlgoliaSearchClient()}
            indexName={getAlgoliaSellerProductIndex()}
            filterQuery={filterQuery}
            changePage={this.changePage.bind(this)}
            sellerProducts={this.props.seller.productsCache}
            currentPage={this.state.currentPage}
            hitsPerPage={this.state.hitsPerPage}
          />
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    seller: state.seller
});

export default connect(mapStateToProps, { getSellerOrders, getAlgoliaSearchClient, getAlgoliaSellerProductIndex })( SellerDashboardProductsPageContainer );
