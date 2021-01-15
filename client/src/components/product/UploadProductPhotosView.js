import React from 'react';

import { FaPhotoVideo } from 'react-icons/fa';

import { GrFormClose } from 'react-icons/gr';

import BrandStyles from 'components/BrandStyles';

import ProductImageUploadInput from './ProductImageUploadInput';

export default function UploadProductPhotosView({photos, onImageFileChange, onRemove}) {
    const spanStyle = { ...BrandStyles.components.iconPlaceholder, marginBottom: 16, paddingTop: 16 };
    if (!photos || photos.length === 0) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 32,
            paddingBottom: 32,
            borderRadius: 16,
            margin: 16,
            backgroundColor: BrandStyles.color.warmlightBeige,
          }}
        >
          <FaPhotoVideo style={BrandStyles.components.iconPlaceholder} />
          <span style={spanStyle}> Add photos to get started </span>
          <ProductImageUploadInput onImageFileChange={onImageFileChange} />
        </div>
      );
    }
    const productPhotoViews = [];
    const iconStyle = {
      ...BrandStyles.components.iconPlaceholder,
      color: BrandStyles.color.xdarkBeige,
      fontSize: 24,
      marginTop: -8,
    };
    photos.forEach((product) => {
      productPhotoViews.push(
        <div style={{ position: 'relative' }}>
          <div
            onClick={onRemove.bind(product)}
            style={{
              position: 'absolute',
              top: 10,
              right: 16,
              zIndex: 100,
              padding: 2,
              width: 28,
              height: 28,
              borderRadius: 100,
              backgroundColor: BrandStyles.color.beige,
              cursor: 'pointer',
            }}
          >
            <GrFormClose style={iconStyle} />
          </div>
          <img
            src={product.sourceURL ? product.sourceURL : product}
            style={{
              width: 200,
              height: 200,
              borderRadius: 16,
              marginTop: 8,
              marginRight: 8,
            }}
          />
        </div>,
      );
    });
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          paddingTop: 32,
          paddingBottom: 32,
          borderRadius: 16,
          margin: 16,
          backgroundColor: BrandStyles.color.xlightBeige,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {productPhotoViews}
        </div>
        <span style={{ fontWeight: 'bold', marginTop: 16 }}> Add more images </span>
        <ProductImageUploadInput onImageFileChange={onImageFileChange} />
      </div>
    );
}