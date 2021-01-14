import React from 'react';
import { useDispatch } from 'react-redux';

import { ProductDescription, NavigationArrow, RowContainer, Image, ToggleVisibility, SoldAndQuantity } from 'components/UI/Row'
import { toggleVisibility } from 'actions';

export default function ProductHit({hit, onClickProduct}) {
    const product = hit;
    const dispatch = useDispatch();
    const handleToggleVisibility = (isVisible) => {
      dispatch(toggleVisibility(product._id, isVisible));
    }
    return (
      <RowContainer onClick={onClickProduct}>
        <Image src={product.imageURLs && product.imageURLs[0]} />
        <ProductDescription product={product} />
        <SoldAndQuantity quantity={product.inventoryAvailableToSell} sold={product.inventoryInStock} />
        <ToggleVisibility checked={product.isVisible} text='IS VISIBLE' toggleChecked={handleToggleVisibility} />
        <NavigationArrow to={`/seller/dashboard/product/${product._id}`} />
      </RowContainer>
    )
}