import React from "react";
import { Box } from "@material-ui/core";
import styled from "styled-components";

import NButton from 'components/UI/NButton';
import { getStatusColor } from 'components/UI/Row/styles/order';

const OrderStatus = styled.span`
  background-color: ${props => getStatusColor(props.status)};
  font-weight: bold;
  justify-content: center;
  text-align: center;
  max-width: 180px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 8px;
  padding-top: 8px;
  border-radius: 8px;
`;

const OrderText = styled.p`
  margin: 0;
  margin-right: 16px;
  color: rgba(68,64,63,0.65);
  white-space: nowrap;
  overflow: hidden;
  line-height: 24px;
  text-overflow: ellipsis;
`

const OrderDescriptionContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  overflow: hidden;
  padding-left: 16px;
`

export default function OrderStatusContainer({ order, onClickTracking }) {
  let shippingButton = null;
  if (order.status === 'shipped' || order.status === 'need-to-fulfill') {
    let shippingText = 'Add tracking number';
    if (order.status === 'shipped') {
      shippingText = 'Update tracking number';
    }
    shippingButton = <NButton theme="secondary" size="x-small" title={shippingText} onClick={onClickTracking} />
  }
  let trackingInfo = null;
  if (order.trackingInfo) {
    trackingInfo = (
      <div>
        Tracking: {order.trackingInfo.trackingId}
        Carrier: {order.trackingInfo.carrier}
      </div>
    )
  }
  return (
    <OrderDescriptionContainer>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <OrderText>
            {order && order.orderNumber && `Order #: ${order.orderNumber}`}
          </OrderText>
          <OrderStatus status={order.status}>
            {order.status}
          </OrderStatus>
        </div>
        {shippingButton}
      </div>
      {trackingInfo}
    </OrderDescriptionContainer>
  );
}
