import React from "react";
import { Box } from "@material-ui/core";
import styled from "styled-components";

import BrandStyles from 'components/BrandStyles';

const TitleText = styled.p`
  width: 100%;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 700;
`

const ProductDescriptionContainer = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  overflow: hidden;
`

const ProductVariationContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const ProductVariationText = styled.span`
  color: ${BrandStyles.color.blue};
  font-size: .8rem;
  font-weight: bold;
`;

export default function ProductDescription({ product }) {
  let variations = [];
  if (product.variationIds && product.variationIds.length > 0)  {
        variations = product.variationIds.map((variation) => {
          const options = variation.optionIds.map((option) => {
            return option.title;
          });
          return (
            <ProductVariationContainer>
              <ProductVariationText>{variation.title}: {options.join(", ")}</ProductVariationText>
            </ProductVariationContainer>);
        });
    }

  return (
    <ProductDescriptionContainer>
      <TitleText>
        {product.title}
      </TitleText>
      {variations}
    </ProductDescriptionContainer>
  );
}
