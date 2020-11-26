import React from 'react';
import { displayPayment } from '../../utils/paymentDisplay';

import BrandStyles from '../BrandStyles';

const styles = {
  fullContainer: {
    backgroundColor: BrandStyles.color.xlightBeige,
    flex: 1,
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
    shadowColor: 'rgba(0,0,0, 0.1)',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginBottom: 8,
    marginTop: 8,
    borderRadius: 8,
    borderColor: BrandStyles.color.darkBeige,
  },
  container: {
    flex: 1,
    backgroundColor: BrandStyles.color.xlightBeige,
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
    shadowColor: 'rgba(0,0,0, 0.1)',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginBottom: 8,
    marginTop: 8,
    borderRadius: 8,
    borderColor: BrandStyles.color.darkBeige,
  },
  image: {
    borderRadius: 8,
    width: 50,
    height: 50,
  },
  textContentContainer: {
    paddingLeft: 8,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 16,
  },
};

const ProductListItem = ({ product, onClickItem, full }) => (
  <div
    style={full ? styles.fullContainer : styles.container}
    onClick={() => {
      onClickItem(product._id);
    }}
  >
    <img src={product.imageURLs[0]} style={styles.image} />
    <div style={styles.textContentContainer}>
      <span style={styles.titleText}>{product.title}</span>
      <span style={styles.priceText}>{displayPayment(product)}</span>
    </div>
  </div>
);

export default ProductListItem;
