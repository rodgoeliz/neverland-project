import React from 'react';

import { OrderDescription, Image, LabelContainer, NavigationArrow, RowContainer, Status } from 'components/UI/Row'

export default class ProductHit extends React.Component{
  constructor(props) {
   super(props);
   this.onClickProduct = this.onClickProduct.bind(this);
  }

  onClickProduct() {  }

  render() {
    const { hit }  = this.props;
    const product = hit;
    return (
      <RowContainer onClick={this.onClickOrder}>
        <LabelContainer labelText={product.createdAt}>
        <Image src={product.imageURLs[0]} />
        <OrderDescription
          order={product._id}
          title={product.title ? product.title: 'Product'}
          />
        </LabelContainer>
            <Status>
              {product.title} 
            </Status>
            <NavigationArrow to={`/seller/dashboard/product/${product._id}`} />
      </RowContainer>

      )
  }
}