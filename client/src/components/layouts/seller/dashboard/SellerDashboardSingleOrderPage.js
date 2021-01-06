import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';

import { createOrderPdf, getOrderById, getProductById } from 'actions';
import { RowContainer, Image, OrderDescription, Price } from 'components/UI/Row';
import Invoice from 'components/UI/Invoice';
import ShippingDetails from 'components/UI/ShippingDetails';

import SellerDashboardNavWrapper from './SellerDashboardNavWrapper';

const OrderDetails = ({ currentOrder, orderId }) => (
  <>
    <Typography variant="h2" component="h2">
      Order# {orderId}
    </Typography>
    <span>
      <b>Date:</b> {(new Date(currentOrder.updatedAt)).toLocaleDateString('en-US')}
    </span>
    <Typography variant="h2" component="h2">
      {currentOrder.billingAddress?.userId.name}
    </Typography>

    {/* Shipping address */}
    <ShippingDetails {...currentOrder.billingAddress} />
  </>
)

export default function SellerDashboardSingleOrderPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { currentOrder } = useSelector(state => state.seller);
  const { productsCache } = useSelector(state => state.products);

  // Fetch order data based on url variable :orderId
  useEffect(() => {
    dispatch(getOrderById(orderId));
  }, [orderId]);

  // Fetch all products, listed in order
  // Will be stored in products reducer
  useEffect(() =>
    // TODO: add logic of checking in store. Could be cached
    currentOrder.storeId?.productIds?.forEach(
      (productId) => dispatch(getProductById(productId))
    ), [currentOrder])

  const handlePrintInvoice = () => {
    const products = currentOrder.storeId.productIds.map(id => productsCache[id]);
    dispatch(createOrderPdf({ orderId, products, currentOrder }));
  }

  return (
    <SellerDashboardNavWrapper>

      {/* Navigation */}
      {/* eslint-disable-next-line */}
      <Link to={'/seller/dashboard/orders'}>{'<< Back to orders'}</Link>

      <OrderDetails currentOrder={currentOrder} orderId={orderId} />

      <Typography variant='h1' component='h2'>Products</Typography>
      <button onClick={handlePrintInvoice}>Print invoice</button>
      {/* Display products in order */}
      {currentOrder.storeId?.productIds.map((productId) => (
        // Products data taken from products reducer, ids from order (seller reducer)
        <RowContainer key={productId}>
          <Image src={productsCache[productId].imageURLs[0]} />
          <OrderDescription
            title={productsCache[productId].title}
            content={[productsCache[productId].description]}
          />
          <Price flexGrow={1} >
            {productsCache[productId].price.value} {productsCache[productId].price.currency}
          </Price>
        </RowContainer>
      ))}

      {/* Invoice section */}
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

