import React, { useState } from "react";
import { Modal } from "@material-ui/core";
import styled from 'styled-components';

import BrandStyles from 'components/BrandStyles';

import shippingCarriers from 'constants/shippingCarriers';

import NButton from 'components/UI/NButton';
import BaseInput from 'components/UI/BaseInput';
import NSelect from 'components/UI/NSelect';

const ModalContentContainer = styled.div`
  background-color: ${BrandStyles.color.beige};
  border-radius: 16px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 32px;
  padding-top: 32px;
  max-width: 480px;
  justify-content: center;
`;

const ModalHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
`

const ModalTitle = styled.span`
  font-weight: bold;
  padding-bottom: 16px;
`;

export default function OrderTrackingModal({ open, handleUpdateTracking, tracking, carrier, handleClose}) {
  let carrierValue = carrier;
  shippingCarriers.map((sCarrier) => {
    if (sCarrier.id === carrier) {
      carrierValue = sCarrier;
      return null;
    }
    return null;
  })
  const [trackingNumber, setTrackingNumber] = useState(tracking);
  const [shippingCarrier, setShippingCarrier] = useState(carrierValue);

  const onChangeTrackingNumber = (key, value) => {
    setTrackingNumber(value);
  }

  const onChangeCarrier = (values) => {
    if (values && values.length > 0) {
      setShippingCarrier(values[0]);
    }
  }

  const onClickUpdateTracking = () => {
    handleUpdateTracking(trackingNumber, shippingCarrier);
  }

  const initValues = shippingCarrier ? [shippingCarrier]: [];
  return (
    <Modal
      style={{borderRadius: 16, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
      open={open}
      onClose={handleClose}>
      <ModalContentContainer>
        <ModalHeaderContainer>
          <ModalTitle> Update Tracking Details</ModalTitle>
          <span> Enter the tracking number and select a shipping carrier below. </span>
        </ModalHeaderContainer>
        <BaseInput 
          onChange={onChangeTrackingNumber}
          keyId="trackingNumber"
          label="Tracking Number"
          value={trackingNumber}
        />
        <NSelect
          items={shippingCarriers}
          itemIdKey="id"
          isSingleSelect
          values={initValues} 
          title="Shipping Carriers"
          itemTitleKey="title"
          placeholderText="Select a carrier..."
          onChangeItems={onChangeCarrier}
        />
        <NButton theme="x-small" title="Update Tracking" onClick={onClickUpdateTracking} />
      </ModalContentContainer>
    </Modal>
  );
}
