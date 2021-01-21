import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from 'components/layouts/seller/dashboard/SellerDashboardProductsPage';
import { getSellerOrders, getAlgoliaSearchClient, getAlgoliaSellerProductIndex, toggleVisibility } from 'actions';

class SellerDashboardProductsPageContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      hitsPerPage: 10
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

  onClickAddProducts = () => {
    this.setState({
      redirectTo: '/seller/dashboard/products/add'
    });
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    const refreshAlgolia = (this.props.location && this.props.location.state) ? this.props.location.state.refresh : false;
    const filterQuery = `vendorId:${this.props.auth._id}`;
    // QUERY: const filterQuery = `vendorId:5fc43c800147f800176841a3`;
    return (
      <Layout
        searchClient={getAlgoliaSearchClient()}
        indexName={getAlgoliaSellerProductIndex()}
        refreshAlgolia={refreshAlgolia}
        filterQuery={filterQuery}
        onClickAddProduct={this.onClickAddProducts.bind(this)}
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

export default connect(mapStateToProps, { getSellerOrders, getAlgoliaSearchClient, toggleVisibility, getAlgoliaSellerProductIndex })(SellerDashboardProductsPageContainer);
