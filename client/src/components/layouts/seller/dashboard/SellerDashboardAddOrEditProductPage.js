import React from 'react';

import AddProductView from 'components/layouts/seller/onboarding/AddProductView';

class SellerDashboardAddOrEditProductPage extends React.Component {

  constructor(props)  {
    super(props);
    console.log("test")
  }

  render() {
    // todo add on go back or on close function
    return (
      <AddProductView 
      onClose={this.props.onClose}
      productId={this.props.productId} />)
  }
}

export default SellerDashboardAddOrEditProductPage;