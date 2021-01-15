import React from 'react';

import { OrderDescription, LabelContainer, NavigationArrow, Image, RowContainer, Price, Status } from 'components/UI/Row'

export default class OrderHit extends React.Component{
  constructor(props) {
   super(props);
   this.onClickOrder = this.onClickOrder.bind(this);
  }

  onClickOrder() { }

  render() {
    const { hit }  = this.props;
    const order = hit;
    let image = null;
    if (order.bundleId?.productOrderItemIds && order.bundleId?.productOrderItemIds.length > 0) {
      const imageUrls = order.bundleId.productOrderItemIds[0].productId.imageURLs;
      if (imageUrls && imageUrls.length > 0) {
        image = <Image src={imageUrls[0]} />;
      }
    }
    console.log("ORDER: ", order)
    return (
      <RowContainer onClick={this.onClickOrder}>
        <LabelContainer labelText={order.createdAt}>
        { image }
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
            <NavigationArrow to={`/seller/dashboard/orders/${order._id}`} />
      </RowContainer>

      )
  }
}