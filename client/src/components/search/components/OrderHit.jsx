import React from 'react';

import { OrderDescription, LabelContainer, NavigationArrow, Image, RowContainer, Price, Status } from 'components/UI/Row'
import { formatPrice } from 'utils/display';

export default function OrderHit({hit, onClickOrder}) {
    const order = hit;
    let image = null;
    if (order.bundleId?.productOrderItemIds && order.bundleId?.productOrderItemIds.length > 0) {
      const imageUrls = order.bundleId.productOrderItemIds[0].productId.imageURLs;
      if (imageUrls && imageUrls.length > 0) {
        image = <Image src={imageUrls[0]} />;
      }
    }
    return (
      <RowContainer onClick={onClickOrder}>
        <LabelContainer labelText={order.createdAt} status={order.status} >
        { image }
        <OrderDescription
          order={order.orderNumber ? order.orderNumber : 'Order ID'}
          title={order.userId ? order.userId.name : 'User name'}
          />
            <Price>
              {formatPrice(order.orderInvoiceId.price.value)} {order.orderInvoiceId.price.currency}
            </Price>
            </LabelContainer>
            <Status status={order.status}>
              {order.status} 
            </Status>
            <NavigationArrow to={`/seller/dashboard/orders/${order._id}`} />
      </RowContainer>

      )
}