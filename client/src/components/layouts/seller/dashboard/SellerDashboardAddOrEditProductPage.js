import React from 'react';

import AddProductView from 'components/product/AddProductView';

class SellerDashboardAddOrEditProductPage extends React.Component {

  constructor(props)  {
    super(props);
    console.log("test")
  }

  render() {
    // todo add on go back or on close function
    return (
      <div style={{minHeight:'80vh'}}>
      <AddProductView 
        onClose={this.props.onClose}
        productId={this.props.productId} />
      </div>
      )
  }
}

export default SellerDashboardAddOrEditProductPage;