import React from 'react';
import { useDispatch } from 'react-redux';

import { ProductDescription, NavigationArrow, RowContainer, Image, ToggleVisibility, SoldAndQuantity } from 'components/UI/Row'
import { toggleVisibility } from 'actions';

export default function UserHit({hit, onClickProduct, isLoading, onRefreshAlgolia}) {
    const product = hit;
    const dispatch = useDispatch();
    const handleToggleVisibility = (isVisible) => {
      dispatch(toggleVisibility(product._id, isVisible));
      onRefreshAlgolia();
    }
    return (
      <RowContainer onClick={onClickProduct}>
        <Image src={product.imageURLs && product.imageURLs[0]} />
        <ProductDescription product={product} />
        <SoldAndQuantity quantity={product.inventoryAvailableToSell} sold={product.inventorySold ? product.inventorySold : 0} />
        <ToggleVisibility checked={product.isVisible} text='IS VISIBLE' toggleChecked={handleToggleVisibility} />
        {isLoading}
        <NavigationArrow to={`/admin/dashboard/user/${product._id}`} />
      </RowContainer>
    )
}