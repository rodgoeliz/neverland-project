import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getOrderById, getProductById } from 'actions';
import { RowContainer, Image, OrderDescription, Price } from 'components/UI/Row';
import Invoice from 'components/UI/Invoice';

import SellerDashboardNavWrapper from './SellerDashboardNavWrapper';

export default function SellerDashboardSingleOrderPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { currentOrder } = useSelector(state => state.seller);
  const { productsCache } = useSelector(state => state.products);

  // Fetch order data based on url variable :orderId
  useEffect(() => {
    dispatch(getOrderById(orderId));
  }, [orderId]);

  useEffect(() =>
    currentOrder.storeId?.productIds?.forEach(
      (productId) => dispatch(getProductById(productId))
    ), [currentOrder])

  return (
    <SellerDashboardNavWrapper>
      <div>{currentOrder.billingAddress?.addressLine1}</div>


      {/* Display products in order */}
      {currentOrder.storeId?.productIds.map((productId) => (
        // Products data taken from products reducer, ids from order (seller reducer)
        <RowContainer key={productId}>
          <Image src={productsCache[productId].imageURLs[0]} />
          <OrderDescription
            title={productsCache[productId].title}
            content={[productsCache[productId].description]}
          />
          <Price>
            {productsCache[productId].price.value} {productsCache[productId].price.currency}
          </Price>
        </RowContainer>
      ))}

      <Invoice
        currency={currentOrder.orderInvoiceId?.price.currency}
        sh={currentOrder.orderInvoiceId?.shipping}
        services={currentOrder.orderInvoiceId?.surcharges}
        subtotal={currentOrder.orderInvoiceId?.subtotal}
        total={currentOrder.orderInvoiceId?.total}
      />
    </SellerDashboardNavWrapper>
  );
}

