import React from 'react';

import { OrderDescription, LabelContainer, NavigationArrow, RowContainer, Price, Status } from 'components/UI/Row'

export default class StoreHit extends React.Component{

  constructor(props) {
   super(props);
   this.onClickOrder = this.onClickOrder.bind(this);
  }

  onClickStore() {
    console.log("CLICK ORDEAR")
  }

  render() {
    const { hit }  = this.props;
    const order = hit;
    return (
      <RowContainer onClick={this.onClickOrder}>
        <LabelContainer labelText={order.createdAt}>
        {/* <Image src={product.imageURLs[0]} /> */}
        <OrderDescription
          order={order._id}
          title={order.userId ? order.userId.name : 'User name'}
          />
            <Price>
              {order.orderInvoiceId.price.value} {order.orderInvoiceId.price.currency}
            </Price>
            </LabelContainer>
            <Status>
              {order.status} 
            </Status>
            <NavigationArrow to='/home' />
      </RowContainer>

      )
  }
}