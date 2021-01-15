import React from 'react';

import BrandStyles from 'components/BrandStyles';

export default function ProductImageUploadInput({ onImageFileChange }) {
  return (
      <div>
        <label
          style={{
            border: `2px solid ${BrandStyles.color.blue}`,
            borderRadius: 16,
            display: 'inline-block',
            padding: '8px 18px',
            cursor: 'pointer',
            color: BrandStyles.color.blue,
            fontWeight: 'bold',
          }}
          htmlFor="file-upload"
          className="custom-file-upload" >
          <i className="fa fa-cloud-upload" /> UPLOAD IMAGES
        </label>
        <input style={{ display: 'none' }} id="file-upload" type="file" onChange={onImageFileChange} multiple />
      </div>
    )
}