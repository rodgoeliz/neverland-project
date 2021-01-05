import React from 'react';

import { Redirect } from 'react-router-dom';

import Layout from 'components/layouts/seller/dashboard/SellerDashboardAddOrEditProductPage';

class SellerDashboardAddOrEditProductPageContainer extends React.Component {

  constructor(props) {
    super(props);
    let passedProductId = "";
    if (props && props.match)  {
      const { match: { params } } = this.props;
      passedProductId = params.productId;
    }
    this.state = {
      productId: passedProductId
    }

    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    console.log("redirect to...")
    this.setState({
      redirectTo: '/seller/dashboard/products'
    })
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect push to={this.state.redirectTo} />;
    }
    return <Layout onClose={this.onClose} productId={this.state.productId} />
  }
}


export default SellerDashboardAddOrEditProductPageContainer;