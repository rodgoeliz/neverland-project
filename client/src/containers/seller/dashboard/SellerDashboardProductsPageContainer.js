import React from 'react';
import { connect } from 'react-redux';

import Layout from 'components/layouts/seller/dashboard/SellerDashboardProductsPage';
import { getSellerProducts, changeSellerPage } from 'actions';


class SellerDashboardProductsPageContainer extends React.Component {
    componentDidMount() {
        // For every update just fetch data for get seller products
        this.props.getSellerProducts(this.props.auth._id);
    }

    changePage = (event, value) => {
        // -1 for start with 0 page.
        this.props.changeSellerPage(value - 1);
    }

    render() {
        return (
          <Layout 
            changePage={this.changePage.bind(this)}
            sellerProducts={this.props.seller.productsCache}/>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    seller: state.seller
});

export default connect(mapStateToProps, { getSellerProducts, changeSellerPage })(SellerDashboardProductsPageContainer);
