import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { createOrderPdf, getOrderById, getProductById } from 'actions';
import { updateTracking } from 'actions/order';

import { RowContainer, Image, OrderDescription, Price } from 'components/UI/Row';
import Invoice from 'components/UI/Invoice';
import OrderStatusContainer from 'modules/seller/order/OrderStatusContainer';
import OrderTrackingModal from 'modules/seller/order/OrderTrackingModal';

import ShippingDetails from 'components/UI/ShippingDetails';
import NButton from 'components/UI/NButton';
import { formatPrice } from 'utils/display';

import SellerDashboardNavWrapper from './SellerDashboardNavWrapper';

const HeaderRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 2em;
  margin-bottom: 2em;
`;

// TODO: fix structure and export into single component beside this page
const OrderDetails = ({ currentOrder, orderId }) => (
  <>
    <p>
      Order# {orderId}
    </p>
    <span>
      <b>Date:</b> {(new Date(currentOrder.updatedAt)).toLocaleDateString('en-US')}
    </span>
    <h3>
      <b>
        {currentOrder.billingAddress?.userId.name}
      </b>
    </h3>

    {/* Shipping address */}
    <ShippingDetails {...currentOrder.billingAddress} />
  </>
)

export default function SellerDashboardSingleOrderPage() {
  const [isModalOpen, setModalOpen] = useState(false);
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
    currentOrder.bundleId?.productOrderItemIds?.forEach(
      (orderProductId) => dispatch(getProductById(orderProductId.productId._id))
    ), [currentOrder])

  const handlePrintInvoice = () => {
    const products = currentOrder.bundleId.productOrderItemIds.map(id => productsCache[id.productId._id]);
    dispatch(createOrderPdf({ orderId, products, currentOrder }));
  }

  const handleOpenModal = () => {
    setModalOpen(true);
  }

  const handleCloseModal = () => {
    setModalOpen(false);
  }

  const handleUpdateTracking = (trackingNumber, shippingCarrier) => {
    dispatch(updateTracking({ orderId, trackingNumber, shippingCarrier:shippingCarrier.id }));
    handleCloseModal();
  }

  return (
    <SellerDashboardNavWrapper>

      {/* eslint-disable-next-line */}
      <Link to={'/seller/dashboard/orders'}>{'<< Back to orders'}</Link>
      <br/>
      <OrderDetails currentOrder={currentOrder} orderId={currentOrder.orderNumber} />

      <h3><b>Status</b></h3>
      <OrderStatusContainer order={currentOrder} onClickTracking={handleOpenModal}/> 
      <OrderTrackingModal 
        tracking={currentOrder.trackingInfo ? currentOrder.trackingInfo.trackingId: null}
        carrier={currentOrder.trackingInfo ? currentOrder.trackingInfo.carrier: null}
        handleUpdateTracking={handleUpdateTracking} 
        order={currentOrder} 
        handleClose={handleCloseModal} 
        open={isModalOpen}/>
      <HeaderRowContainer>
        <h3><b>Products</b></h3>
        <NButton theme="secondary" size="x-small" title='Print invoice' onClick={handlePrintInvoice} />
      </HeaderRowContainer>
      {/* Display products in order */}
      {currentOrder.bundleId?.productOrderItemIds?.map((orderProductId) => {
        const { productId } = orderProductId;
        // Products data taken from products reducer, ids from order (seller reducer)
        return (
          <RowContainer key={productId}>
            <Image src={productId.imageURLs[0]} />
            <OrderDescription
              title={productId.title}
            />
            <Price flexGrow={1} >
              {formatPrice(productId.price.value)} {productId.price.currency}
            </Price>
          </RowContainer>)
        }
      )}

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

