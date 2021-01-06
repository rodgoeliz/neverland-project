import React from 'react';
import { useDispatch } from 'react-redux';

import { OrderDescription, NavigationArrow, RowContainer, Image, ToggleVisibility, SoldAndQuantity } from 'components/UI/Row'
import { toggleVisibility } from 'actions';

export default function ProductHit({hit}) {
    const product = hit;
    const dispatch = useDispatch();
    const handleToggleVisibility = (isVisible) => {
      dispatch(toggleVisibility(product._id, isVisible));
    }

    return (
      <RowContainer>
        <Image src={product.imageURLs && product.imageURLs[0]} />
        <OrderDescription
          order={product._id}
          title={product.title ? product.title : 'Product'}
        />
        <SoldAndQuantity quantity={product.inventoryAvailableToSell} sold={product.inventoryInStock} />
        <ToggleVisibility checked={product.isVisible} text='IS VISIBLE' toggleChecked={handleToggleVisibility} />
        <NavigationArrow to={`/seller/dashboard/product/${product._id}`} />
      </RowContainer>
    )
}