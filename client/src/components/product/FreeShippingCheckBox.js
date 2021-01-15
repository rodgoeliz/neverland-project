import React from 'react';
import styled from 'styled-components';

import BrandStyles from 'components/BrandStyles';
import CheckBoxInput from 'components/UI/CheckBoxInput';

import { shippingPreferences } from 'constants/storeData';

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputLabel = styled.label `
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 16px;
  margin-left : 16px;
`;

const InputDescription = styled.label`
  font-size: 12px;
  margin-left: 16px;
  max-width: 600px;
`;

const BlueInputDescription = styled.label`
  color: ${BrandStyles.color.blue};
  font-size: 12px;
  margin-left: 16px;
  max-width: 600px;
`;

export default function FreeShippingCheckBox({storeShippingPreference, onToggle, error, value}) {
  const disableCheckBoxChanges = storeShippingPreference === shippingPreferences.MANUAL;
  let subNote = "";
  if (storeShippingPreference === shippingPreferences.MANUAL) {
    subNote = "You can't change this because your shipping preference for your store is set to Manual. Please incorporate your shipping cost into the price. If you'd like to change this to a different shipping preference, please go to Shipping & Packaging."
  } else {
    subNote = "Your shipping preference is Neverland shipping through Shippo. If you enable Free Shipping, it'll be subtracted from your order payout and the label will be automatically generated.";
  }
  return (
          <div
            style={{
              backgroundColor: BrandStyles.color.xlightBeige,
              borderRadius: 8,
              paddingLeft: 4,
              paddingTop: 8,
              paddingBottom: 8,
              paddingRight: 4,
            }}
          >
          <ColumnContainer>
            <InputLabel>Offer Free Shipping <b>(Recommended)</b></InputLabel>
            <InputDescription>
              Offering free shipping can increase orders by <b>40% or more</b>. 
              We recommend that you incorporate your average shipping price into the base price above if you use this option.
            </InputDescription>
          </ColumnContainer>
          <CheckBoxInput
            disabled={disableCheckBoxChanges}
            value={value}
            label="Offer Free Shipping"
            onValueChange={onToggle}
            error={error}
          />
          <BlueInputDescription>
            {subNote}
          </BlueInputDescription>
          </div>
          );
}