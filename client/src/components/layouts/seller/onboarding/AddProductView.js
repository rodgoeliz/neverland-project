import React, { Component } from 'react';
import Switch from 'react-switch';
// import ImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';

import ClipLoader from 'react-spinners/ClipLoader';

import Modal from 'react-modal';


import { FaPhotoVideo, FaRegEdit } from 'react-icons/fa';

import { GrFormClose } from 'react-icons/gr';

import searchMetaDataTags from 'constants/searchMetaDataTags.js';

import BrandStyles from 'components/BrandStyles';

import { transformProductToFormData } from 'utils/productHelpers';

import isZipCodeValid from 'utils/zipcodeValidator';

import isNumberValid from 'utils/numberValidator';

import BaseInput from 'components/UI/BaseInput';
import CheckBoxInput from 'components/UI/CheckBoxInput';
import NSelect from 'components/UI/NSelect';

import {
  clearSellerCurrentProductCache,
  loadAllProductCategories,
  loadAllProductTags,
  loadSellerProduct,
  clearTagsAndCategories,
  getSellerProducts
} from 'actions/seller';

import { setOnBoardingStepId, logoutFirebase } from 'actions/auth';
import { createProduct, createTestProduct, updateProduct, getProductSearchMetaData } from 'actions/products';

import NButton from 'components/UI/NButton';

import AddProductVariationView from './AddProductVariationView';

const PROCESSING_TIME_VALUES = [
  { id: 'twenty-four-hours', value: '24 Hrs' },
  { id: 'two-three-days', value: '2-3 days' },
  { id: 'three-five-days', value: '3-5 days' },
  { id: 'one-two-weeks', value: '1-2 weeks' },
  { id: 'more-than-two-weeks', value: '2+ weeks' },
];

const styles = {
  optionEditIcon: {
    marginRight: 4,
  },
  optionEditContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: BrandStyles.color.warmlightBeige,
    borderBottomWidth: 2,
    borderColor: BrandStyles.color.blue,
  },
  optionEditContentWrapper: {
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'flex-start',
    flex: 1,
  },
  optionEditTextInputWrapper: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
  },
  optionEditTextInput: {
    flex: 1,
    minHeight: 32,
    marginRight: 4,
    marginTop: 2,
    marginLeft: 16,
  },
  optionEditLabel: {
    marginTop: 4,
    marginLeft: 16,
  },
  iconSpacing: {
    marginRight: 8,
  },
};

// if the product variations have price varied -> then it's "additional" pricing to main price
// means we want to display the main price field - always
//  if sku and quantity varies, then display individual sku and quantity fields, otherwise display main quantity and sku field
// a

class AddProductView extends Component {
  constructor(props) {
    super(props);
    let { variations } = props;
    if (!variations) {
      variations = [];
    }

    let updatedFormData = {
      metaData: {},
    };

    // means we are editing the product;
    const loadedProduct = props.product;
    console.log("loadedProduct:", props.product);
    if (loadedProduct) {
      updatedFormData = transformProductToFormData(loadedProduct);
    }

    this.state = {
      isProductVariantModalVisible: false,
      formData: updatedFormData,
      product: props.product,
      errors: {}
    };
    // props.onChange(this.state);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.addPhotosToState = this.addPhotosToState.bind(this);
    this.toggleSelection = this.toggleSelection.bind(this);
    this.openProductVariantModal = this.openProductVariantModal.bind(this);
    this.onRequestProductVariantModalClose = this.onRequestProductVariantModalClose.bind(this);
    this.onMultiSelectItemsChange = this.onMultiSelectItemsChange.bind(this);
    this.onSaveVariations = this.onSaveVariations.bind(this);
    this.onChangeVariations = this.onChangeVariations.bind(this);
    this.onChangeEditOptionText = this.onChangeEditOptionText.bind(this);
    this.setEditingState = this.setEditingState.bind(this);
    this.getEditingState = this.getEditingState.bind(this);
    this.onImageFileChange = this.onImageFileChange.bind(this);
    this.saveProduct = this.saveProduct.bind(this);
  }

  async initTags() {
    await this.props.loadAllTags();
    await this.props.loadAllCategories();
    await this.props.getProductSearchMetaData();
    this.setState({
      isLoading: false,
    });
  }

  async componentDidMount() {
    if (
      !this.props.allProductCategories ||
      !this.props.allProductTags ||
      !this.props.productSearchMetaDataTags ||
      !this.props.stores ||
      this.props.stores.length === 0 ||
      this.props.allProductCategories.length === 0 ||
      this.props.allProductTags.length === 0
    ) {
      this.setState(
        {
          isLoading: true,
        },
        this.initTags.bind(this),
      );
    }

    // means we are editing a product, so we must pull it
    let passedProductId = this.props.productId; // ? this.props.productId : params.productId;
    if (this.props && this.props.match) {
      const { match: { params } } = this.props;
      passedProductId = params.productId;
    }
    if (passedProductId) {
      this.setState(
        {
          isLoading: true,
        },
        async () => {
          const sellerProduct = await this.props.loadSellerProduct({ productId: passedProductId });
          console.log("SELLER PRODUCT: ", sellerProduct)
          const transformedProductFD = transformProductToFormData(sellerProduct);
          this.setState({
            formData: transformedProductFD,
            product: sellerProduct,
            isLoading: false,
          });
        },
      );
    } else {
      // this.props.clearSellerProductCache();
    }
  }

  transformToFormData(jsonObj, formData) {
    for (const key in jsonObj) {
      console.log(key, JSON.stringify(jsonObj[key]))
      switch (key) {
        case 'variations':
          formData.append(key, JSON.stringify(jsonObj[key]));
          break;
        case 'categories':
        case 'productTags':
          formData.append(key, JSON.stringify(jsonObj[key]));
          break;
        case 'description':
        case 'handlingFee':
        case 'itemHeightIn':
        case 'itemWeightLb':
        case 'itemLengthIn':
        case 'itemWeightOz':
        case 'itemWidthIn':
        case 'originZipCode':
        case 'productPrice':
        case 'productQuantity':
        case 'productSKU':
        case 'title':
          formData.append(key, jsonObj[key]);
          break;
        case 'storeId':
          break;
        case 'productPhotos':
          formData.append(key, JSON.stringify(jsonObj[key]));
          break;
        case 'processingTime':
          const processingTime = jsonObj[key];
          if (processingTime.length > 0) {
            formData.append(key, processingTime[0].id);
          }
          break;
        case 'metaData.light':
        case 'metaData.color':
        case 'metaData.level':
        case 'metaData.water-level':
        case 'metaData.style':
        case 'metaData.benefit':
        case 'metaData.size':
        case 'metaData':
          if (key && jsonObj[key]) {
            formData.append(key, JSON.stringify(jsonObj[key]));
          }
          break;
        default:
          formData.append(key, jsonObj[key]);
          break;
      }
    }
    return formData;
  }

  updateFormData(formData) {
    this.setState(
      {
        formData,
      },
      () => {
        // this.props.onChange(this.state);
      },
    );
  }

  onChangeInput(key, value) {
    const newFormData = { ...this.state.formData };
    newFormData[key] = value;
    this.updateFormData(newFormData);
    // this props on change product input
  }

  onSaveProduct() {
    this.onSubmitProduct();
  }

  onPressAddPhoto() {}

  addPhotosToFormData(photosArr) {
    const newFormData = { ...this.state.formData };
    let photos = newFormData.productPhotos;
    if (!photos) {
      photos = Array.from(photosArr);
    } else {
      photos = photos.concat(Array.from(photosArr));
    }
    newFormData.productPhotos = photos;
    this.updateFormData(newFormData);
  }

  addPhotosToState(photosArr) {
    const newFormData = { ...this.state.formData };
    let photos = newFormData.productPhotosData;
    if (!photos) {
      photos = photosArr;
    } else {
      photos = photos.concat(photosArr);
    }
    newFormData.productPhotosData = photos;
    this.updateFormData(newFormData);
  }

  validateInput() {
    const { errors } = this.state;
    let isValid = true;
    if (!this.state.formData) {
      errors.root = 'Please complete the form.';
      this.setState({ errors });
      return false;
    }
    errors.root = '';

    if (this.state.formData.isProductVariationsVisible) {
      const { variations } = this.state.formData;
      if (variations && variations.length === 0) {
        errors.variations = 'Please add variations or toggle off.';
        isValid = false;
      } else {
        errors.variations = '';
      }
    }

    if (!this.state.formData.isProductVariationsVisible) {
      const { productPrice } = this.state.formData;
      if (!productPrice || productPrice.length < 1) {
        errors.productPrice = 'Enter a valid price.';
        isValid = false;
      } else {
        errors.productPrice = '';
      }
      const { productQuantity } = this.state.formData;
      if (!productQuantity || productQuantity.length < 1) {
        errors.productQuantity = 'Enter a valid quantity.';
        isValid = false;
      } else {
        errors.productQuantity = '';
      }
      const { productSKU } = this.state.formData;
      if (!productSKU || productSKU.length < 3) {
        errors.productSKU = 'Enter a valid SKU.';
        isValid = false;
      } else {
        errors.productSKU = '';
      }
    }

    const { title } = this.state.formData;
    if (!title || title.length < 3) {
      errors.title = 'Please enter a title.';
      isValid = false;
    } else {
      errors.title = '';
    }

    const { description } = this.state.formData;
    if (!description || description.length === 0) {
      errors.description = 'Please enter a description.';
      isValid = false;
    } else {
      errors.description = '';
    }

    // productTags
    const { productTags } = this.state.formData;
    if (!productTags || productTags.length === 0) {
      errors.productTags = 'Please select at least one product tag.';
      isValid = false;
    } else {
      errors.productTags = '';
    }
    const { categories } = this.state.formData;
    if (!categories || categories.length === 0) {
      errors.categories = 'Please select at least one category.';
      isValid = false;
    } else {
      errors.categories = '';
    }

    const { processingTime } = this.state.formData;
    if (!processingTime || processingTime.length === 0) {
      errors.processingTime = 'Please select a processing time.';
      isValid = false;
    } else {
      errors.processingTime = '';
    }

    const { itemHeightIn } = this.state.formData;
    if (!itemHeightIn || itemHeightIn.length === 0) {
      errors.itemHeightIn = 'Please enter item height.';
      isValid = false;
    } else {
      errors.itemHeightIn = '';
    }
    const { itemLengthIn } = this.state.formData;
    if (!itemLengthIn || itemLengthIn.length === 0) {
      errors.itemLengthIn = 'Please enter item length.';
      isValid = false;
    } else {
      errors.itemLengthIn = '';
    }
    const { itemWeightLb } = this.state.formData;
    if (!itemWeightLb || itemWeightLb.length === 0) {
      errors.itemWeightLb = 'Please enter item weight.';
      isValid = false;
    } else {
      errors.itemWeightLb = '';
    }
    const { itemWeightOz } = this.state.formData;
    if (!itemWeightOz || itemWeightOz.length === 0) {
      errors.itemWeightOz = 'Please enter item weight (oz).';
      isValid = false;
    } else {
      errors.itemWeightOz = '';
    }
    const { itemWidthIn } = this.state.formData;
    if (!itemWidthIn || itemWidthIn.length === 0) {
      isValid = false;
      errors.itemWidthIn = 'Please enter item width (in).';
    } else {
      errors.itemWidthIn = '';
    }

    const { productPhotos } = this.state.formData;
    if (!productPhotos || productPhotos.length === 0) {
      errors.productPhotos = 'Please select product photos.';
      isValid = false;
    } else {
      errors.productPhotos = '';
    }

    const { originZipCode } = this.state.formData;
    if (!originZipCode || originZipCode.length === 0) {
      isValid = false;
      errors.originZipCode = 'Please enter zip code.';
    } else {
      errors.originZipCode = '';
    }
    if (!isValid) {
      errors.root = 'Please complete all required fields in the form.';
      this.setState({ errors });
      return false;
    } 
      errors.root = '';
    

    this.setState(
      {
        errors,
      },
      () => { },
    );
    return isValid;
  }

  async saveProduct() {
    const valid = this.validateInput();
    if (!valid) {
      return;
    }
    this.setState({ isSavingProduct: true });

    let currentProduct = this.props.product ? this.props.product : this.props.currentSellerProduct;
    if (!currentProduct && this.state.product) {
      currentProduct = this.state.product;
    }
    console.log("saveProduct", this.state)
    let formData = new FormData();
    // formData.append('my_photos')
    if (this.state.formData.productPhotos) {
      for (let i = 0; i < this.state.formData.productPhotos.length; i++) {
        const photo = this.state.formData.productPhotos[i];
        formData.append(`productImageFile[${i}]`, photo);
        /* {
           uri: photo.sourceURL,
           type: photo.mime,
           name: this.state.formData.title + '-' + this.props.user._id + 'productImage' + i,
         }); */
      }
    }
    formData = this.transformToFormData(this.state.formData, formData);
    // if we didn't assign a store, pull user store
    console.log("STOREID: ", this.state.formData.storeId[0]);
    console.log("USERID : ", this.props.user._id);
    if (!this.state.formData.storeId) {
      formData.append('userId', this.props.user._id);
      if (typeof this.props.user.storeId === 'string') {
        formData.append('storeId', this.props.user.storeId);
      } else if (typeof this.props.user.storeId === 'object') {
        formData.append('storeId', this.props.user.storeId._id);
      }
    } else if (this.state.formData.storeId && this.state.formData.storeId.length === 1) {
        const store = this.state.formData.storeId[0];
        if (typeof store === "object") {
          formData.append('storeId', store._id);
          formData.append('userId', this.props.user._id);
        } else if (typeof store.storeId === "string") {
          formData.append('storeId', store)
          if (typeof store.userId === "object") {
            formData.append('vendorId', store.userId._id);
            formData.append('userId', store.userId._id);
          } else if (typeof store.userId === "string") {
            formData.append('vendorId', store.userId);
            formData.append('userId', store.userId);
          }
        }
      }
    const existingProduct = this.state.product;
    console.log("FORM DATA", formData)
    if (existingProduct) {
      formData.append('productId', existingProduct._id);
      // await this.props.updateProduct({ formData });
    //  this.onCloseView();
      return;
    }

    // await this.props.createProduct({ formData });
    this.setState({ isSavingProduct: false });
    // this.onCloseView();
  }

  async onSubmitProduct() {
    this.saveProduct();
  }

  onChange(formData) {
    const { errors } = this.state;
    for (const key in formData.formData) {
      if (formData.formData[key]) {
        errors[key] = formData.formData[key].error;
      }
    }
    this.setState(
      {
        formData: formData.formData,
        errors,
      },
      () => {
      },
    );
  }

  onCloseView() {
    if (this.props.onClose) {
      this.props.onClose();
    } else {
      window.location.reload();
    }
  }

  toggleSelection(key) {
    const newFormData = { ...this.state.formData };
    newFormData[key] = !newFormData[key];
    this.setState(
      {
        formData: newFormData,
      },
      () => {
        // this.onChange(this.state);
      },
    );
  }

  removeImageUrl(productPhoto) {
    const newFormData = { ...this.state.formData };
    const productPhotos = newFormData.productPhotosData;
    const index = productPhotos.findIndex((product) => product === productPhoto);
    productPhotos.splice(index, 1);
    newFormData.productPhotosData = productPhotos;
    this.setState(
      {
        formData: newFormData,
      },
      () => {
        // this.props.onChange(this.state);
      },
    );
  }

  onImageFileChange(e) {
    const promises = [];
    Array.from(e.target.files).forEach((file) => {
      const url = new Promise((resolve) => {
        const reader = new FileReader();
        if (file && file.type.match('image.*')) {
          try {
            reader.readAsDataURL(file);
            reader.onloadend = function () {
              resolve(reader.result);
            };
          } catch (error) {
            console.log(error);
          }
        }
      });
      promises.push(url);
    });
    const origFiles = e.target.files;
    Promise.all(promises).then((files) => {
      this.addPhotosToState(files);
      this.addPhotosToFormData(origFiles);
    });
  }

  renderImageUploadInput() {
    return (
      <div>
        <label
          htmlFor="file-upload"
          style={{
            border: `2px solid ${BrandStyles.color.blue}`,
            borderRadius: 16,
            display: 'inline-block',
            padding: '8px 18px',
            cursor: 'pointer',
            color: BrandStyles.color.blue,
            fontWeight: 'bold',
          }}
          className="custom-file-upload"
        >
          <i className="fa fa-cloud-upload" /> UPLOAD IMAGES
        </label>
        <input style={{ display: 'none' }} id="file-upload" type="file" onChange={this.onImageFileChange} multiple />
      </div>
    );
  }

  renderChosenPhotos() {
    const photos = this.state.formData.productPhotosData;
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
          {this.renderImageUploadInput()}
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
            onClick={this.removeImageUrl.bind(this, product)}
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
        {this.renderImageUploadInput()}
      </div>
    );
  }

  onRequestProductVariantModalClose() {
    this.setState({
      isProductVariantModalVisible: false,
    });
  }

  openProductVariantModal() {
    this.setState({
      isProductVariantModalVisible: true,
    });
  }

  onSaveVariations(variationState) {
    const newFormData = { ...this.state.formData };
    newFormData.variationFormData = variationState;

    this.setState(
      {
        formData: newFormData,
      },
      () => {
        this.onRequestProductVariantModalClose();
        // this.props.onChange(this.state);
      },
    );
  }

  onChangeVariations(variations) {
    const newFormData = { ...this.state.formData };
    newFormData.variations = variations;
    this.setState(
      {
        formData: newFormData,
      },
      () => {
        // this.props.onChange(this.state);
      },
    );
  }

  onMultiSelectItemsChange(key, values) {
    const newFormData = { ...this.state.formData };
    newFormData[key] = values;

    this.setState(
      {
        formData: newFormData,
      },
      () => {
        // this.props.onChange(this.state);
      },
    );
  }

  renderProductVariantModalHeader() {
    return(
            <div
              style={{
                position: 'absolute',
                top: 0,
                zIndex: 100,
                backgroundColor: BrandStyles.color.lightBeige,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                minHeight: 64,
              }}
            >
              <NButton size="x-small" title="Close" theme="secondary" onClick={this.onRequestProductVariantModalClose} />
              <NButton size="x-small" title="Save" onClick={this.onRequestProductVariantModalClose} />
            </div>
    ) 
  }

  renderProductVariantModal() {
    return (
      <div>
       <Modal
          style={{ content: { borderRadius: 32, backgroundColor: BrandStyles.color.lightBeige } }}
          shouldCloseOnOverlayClick
          animationType="slide"
          transparent={false}
          presentationStyle="fullScreen"
          isOpen={this.state.isProductVariantModalVisible}
          onRequestClose={this.onRequestProductVariantModalClose}
        >
          <AddProductVariationView
            onCloseModal={this.onRequestProductVariantModalClose}
            onSaveVariations={this.onSaveVariations}
            onChangeVariations={this.onChangeVariations}
            variations={this.state.formData.variations}
          />
        </Modal>
      </div>
    );
  }

  onChangeEditOptionText(optionSlug, key, value) {
    const newFormData = { ...this.state.formData };
    const { variations } = this.state.formData;
    if (!variations) {
      return false;
    }

    const updatedVariations = [];
    for (let i = 0; i < variations.length; i++) {
      const variation = variations[i];
      const { options } = variation;
      for (let j = 0; j < options.length; j++) {
        const option = options[j];
        if (option.handle === optionSlug) {
          option[key] = value;
        }
      }
      variation.options = options;
      updatedVariations.push(variation);
    }
    newFormData.variations = updatedVariations;
    this.setState(
      {
        formData: newFormData,
      },
      () => {
        // this.props.onChange(this.state);
      },
    );
  }

  setEditingState(optionSlug, key, value) {
    const newFormData = { ...this.state.formData };
    const { variations } = this.state.formData;
    if (!variations) {
      return false;
    }
    const updatedVariations = [];
    for (let i = 0; i < variations.length; i++) {
      const variation = variations[i];
      const { options } = variation;
      for (let j = 0; j < options.length; j++) {
        const option = options[j];
        if (option.handle === optionSlug) {
          option[key] = value;
        }
      }
      variation.options = options;
      updatedVariations.push(variation);
    }
    newFormData.variations = updatedVariations;
    this.setState(
      {
        formData: newFormData,
      },
      () => {
        // this.props.onChange(this.state);
      },
    );
  }

  toggleProductVariationsVisibility() {
    const newFormData = { ...this.state.formData };
    newFormData.isProductVariationsVisible = !newFormData.isProductVariationsVisible;
    this.setState(
      {
        formData: newFormData,
      },
      () => {
        // this.props.onChange(this.state);
      },
    );
  }

  toggleProductVisibility() {
    const newFormData = { ...this.state.formData };
    newFormData.isVisible = !newFormData.isVisible;
    this.setState(
      {
        formData: newFormData,
      },
      () => {
        // this.props.onChange(this.state);
      },
    );
  }

  toggleVisibility(optionSlug, key) {
    const newFormData = { ...this.state.formData };
    const { variations } = newFormData;
    if (!variations) {
      return;
    }
    for (let i = 0; i < variations.length; i++) {
      const variation = variations[i];
      const { options } = variation;
      for (let j = 0; j < options.length; j++) {
        const option = options[j];
        if (option.handle === optionSlug) {
          option[key] = !option[key];
        }
      }
    }

    this.setState(
      {
        formData: newFormData,
      },
      () => {
        // this.props.onChange(this.state);
      },
    );
  }

  getEditingState(optionSlug, key) {
    const { variations } = this.state.formData;
    if (!variations) {
      return false;
    }
    for (let i = 0; i < variations.length; i++) {
      const variation = variations[i];
      const { options } = variation;
      for (let j = 0; j < options.length; j++) {
        const option = options[j];
        if (option.handle === optionSlug) {
          return option[key];
        }
      }
    }
  }

  renderProductVariationsTable() {
    const { variations } = this.state.formData;
    const variationEditableViews = [];
    const labelStyle = BrandStyles.components.inputBase.label;
    if (variations) {
      variations.forEach((variation) => {
        const skuVaried = variation.isSKUVaried;
        const priceVaried = variation.isPriceVaried;
        const quantityVaried = variation.isQuantityVaried;
        const { options } = variation;
        const editableOptionViews = [];
        const iconStyle = { ...BrandStyles.components.iconPlaceholder, ...styles.iconSpacing };
        const spanStyle = { ...labelStyle, marginLeft: 4 };
        const spanEditStyle = { ...labelStyle, ...styles.optionEditLabel };
        if (options) {
          for (let i = 0; i < options.length; i++) {
            const option = options[i];
            editableOptionViews.push(
              <div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginLeft: 16,
                  }}
                >
                  <span style={{ fontWeight: 'bold', fontSize: 14 }}>{option.title}</span>
                  <div style={{ margin: 4, flexDirection: 'column' }}>
                    {/* toggle isVisible */}
                    <span style={spanStyle}>Is Visible</span>
                    <Switch
                      onChange={this.toggleVisibility.bind(this, option.handle, 'isVisible')}
                      checked={option.isVisible}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {skuVaried ? (
                    <div style={{ flex: 1, margin: 4 }}>
                      {this.getEditingState(option.handle, 'isEditingSku') ? (
                        <div style={styles.optionEditContainer}>
                          <div style={styles.optionEditContentWrapper}>
                            <span style={spanEditStyle}>SKU</span>
                            <div style={styles.optionEditTextInputWrapper}>
                              <input
                                style={styles.optionEditTextInput}
                                value={option.sku}
                                onChange={(value) => {
                                  this.onChangeEditOptionText(option.handle, 'sku', value.target.value);
                                }}
                                onBlur={() => {
                                  this.setEditingState(option.handle, 'isEditingSku', false);
                                }}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    this.setEditingState(option.handle, 'isEditingSku', false);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={styles.optionEditContainer}>
                          <div style={styles.optionEditContentWrapper}>
                            <span style={spanEditStyle}>SKU</span>
                            <div style={styles.optionEditTextInputWrapper}>
                              <span
                                style={styles.optionEditTextInput}
                                onClick={() => {
                                  this.setEditingState(option.handle, 'isEditingSku', true);
                                }}
                              >
                                {option.sku}
                              </span>
                              <FaRegEdit style={iconStyle} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div />
                  )}
                  {priceVaried ? (
                    <div style={{ flex: 1, margin: 4 }}>
                      {this.getEditingState(option.handle, 'isEditingPrice') ? (
                        <div style={styles.optionEditContainer}>
                          <div style={styles.optionEditContentWrapper}>
                            <span style={spanEditStyle}>Additional Cost</span>
                            <div style={styles.optionEditTextInputWrapper}>
                              <input
                                style={styles.optionEditTextInput}
                                value={option.price}
                                keyboardType="numeric"
                                onChange={(value) => {
                                  this.onChangeEditOptionText(option.handle, 'price', value.target.value);
                                }}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    this.setEditingState(option.handle, 'isEditingPrice', false);
                                  }
                                }}
                                onBlur={() => {
                                  this.setEditingState(option.handle, 'isEditingPrice', false);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={styles.optionEditContainer}>
                          <div style={styles.optionEditContentWrapper}>
                            <span style={spanEditStyle}>Additional Cost</span>
                            <div style={styles.optionEditTextInputWrapper}>
                              <span
                                style={styles.optionEditTextInput}
                                onClick={() => {
                                  this.setEditingState(option.handle, 'isEditingPrice', true);
                                }}
                              >
                                {option.price}
                              </span>
                              <FaRegEdit style={iconStyle} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div />
                  )}
                  {quantityVaried ? (
                    <div style={{ flex: 1, margin: 4 }}>
                      {this.getEditingState(option.handle, 'isEditingQuantity') ? (
                        <div style={styles.optionEditContainer}>
                          <div style={styles.optionEditContentWrapper}>
                            <span style={spanEditStyle}>Quantity</span>
                            <div style={styles.optionEditTextInputWrapper}>
                              <input
                                value={option.quantity}
                                style={styles.optionEditTextInput}
                                keyboardType="numeric"
                                onChange={(value) => {
                                  this.onChangeEditOptionText(option.handle, 'quantity', value.target.value);
                                }}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    this.setEditingState(option.handle, 'isEditingQuantity', false);
                                  }
                                }}
                                onBlur={() => {
                                  this.setEditingState(option.handle, 'isEditingQuantity', false);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={styles.optionEditContainer}>
                          <div style={styles.optionEditContentWrapper}>
                            <span style={spanEditStyle}>Quantity</span>
                            <div style={styles.optionEditTextInputWrapper}>
                              <span
                                style={styles.optionEditTextInput}
                                onClick={() => {
                                  this.setEditingState(option.handle, 'isEditingQuantity', true);
                                }}
                              >
                                {option.quantity}
                              </span>
                              <FaRegEdit style={iconStyle} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              </div>,
            );
          }
        }
        variationEditableViews.push(
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
            <span style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>{variation.title}</span>
            {editableOptionViews}
          </div>,
        );
      });
    }
    return variationEditableViews;
  }

  onNSelectChangeMetaDataItems(key, newValues) {
    const { formData } = this.state;
    formData.metaData[key] = newValues;
    this.setState(
      {
        formData,
      },
      () => {},
    );
  }

  onNSelectChangeNewItems(key, newValues) {
    const { formData } = this.state;
    formData[key] = newValues;
    this.setState(
      {
        formData,
      },
      () => {},
    );
  }

  basicTextValidate(minChar, value) {
    return !(!value || value.length < minChar);
  }

  checkVariationEnabled(key) {
    const { variations } = this.state.formData;
    let isVariationKeyEnabled = false;
    for (const i in variations) {
      const variation = variations[i];
      if (variation[key]) {
        isVariationKeyEnabled = true;
      }
    }
    return isVariationKeyEnabled;
  }

  genMainProductVariationBaseInfoTable() {
    // if sku varies for any variation option, don't display
    // if quantity varies for any variation, don't display
    // price always display
    const pvBaseInfoViews = [];
    pvBaseInfoViews.push(
      <BaseInput
        onChange={this.onChangeInput}
        keyId="productPrice"
        label="Base Price"
        full
        value={this.state.formData.productPrice ? this.state.formData.productPrice : null}
        validate={this.basicTextValidate.bind(this, 2)}
        error={this.state.errors.productPrice}
      />,
    );
    if (!this.checkVariationEnabled('isSKUVaried')) {
      pvBaseInfoViews.push(
        <BaseInput
          onChange={this.onChangeInput}
          keyId="productSKU"
          label="Base SKU"
          full
          value={this.state.formData.productSKU ? this.state.formData.productSKU : null}
          validate={this.basicTextValidate.bind(this, 2)}
          error={this.state.errors.productSKU}
        />,
      );
    }
    if (!this.checkVariationEnabled('isQuantityVaried')) {
      pvBaseInfoViews.push(
        <BaseInput
          onChange={this.onChangeInput}
          keyId="productQuantity"
          label="Base Quantity"
          full
          value={this.state.formData.productQuantity ? this.state.formData.productQuantity : null}
          validate={this.basicTextValidate.bind(this, 1)}
          error={this.state.errors.productQuantity}
        />,
      );
    }
    return <div style={{ display: 'flex', flexDirection: 'column' }}>{pvBaseInfoViews}</div>;
  }

  renderProductBasics() {
    const existingVariations = this.state.formData.variations;
    let variationsView = null;
    const isExistingVariations = existingVariations && existingVariations.length !== 0;

    const productVariationToggleContent = this.genMainProductVariationBaseInfoTable();
    // if (!this.state.formData.isProductVariationsVisible) {
    // variationsView = productVariationToggleContent;
    // } else {
    if (isExistingVariations) {
      variationsView = (
        <div
          style={{
            marginLeft: 16,
            marginRight: 16,
            marginBottom: 16,
            marginTop: 4,
            padding: 8,
            backgroundColor: BrandStyles.color.warmlightBeige,
            borderRadius: 16,
          }}
        >
          <span style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>Product Variations</span>
          <div style={{ marginTop: 16 }}>{this.renderProductVariationsTable()}</div>
          <div style={{ marginTop: 16 }}>
            <NButton title="Edit Variations" onClick={this.openProductVariantModal} />
          </div>
        </div>
      );
    } else {
      variationsView = (
        <div>
          <div
            style={{
              marginLeft: 16,
              marginRight: 16,
              marginBottom: 16,
              marginTop: 4,
              padding: 32,
              backgroundColor: BrandStyles.color.warmlightBeige,
              borderRadius: 16,
            }}
          >
            <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}>
              <span style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>Product Variations</span>
              <span style={{ textAlign: 'center' }}>Add new product variations (color, size, etc) </span>
            </div>
            <NButton title="Add Variations" onClick={this.openProductVariantModal} />
          </div>
        </div>
      );
    }
    // }

    const labelStyle = this.state.errors.variations
      ? BrandStyles.components.inputBase.errorLabel
      : BrandStyles.components.inputBase.label;
    const errorLabelStyle = { ...BrandStyles.components.inputBase.errorLabel, textAlign: 'center' };
    const marginLabelStyle = { ...labelStyle, marginLeft: 16 };
    return (
      <form>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center', marginLeft: 16 }}>
            {' '}
            Product Photos{' '}
          </span>
          <span style={errorLabelStyle}>{this.state.errors.productPhotos}</span>
          {this.renderChosenPhotos()}
        </div>
        <div style={{ height: 8 }} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: BrandStyles.color.warmlightBeige,
            padding: 16,
            alignItems: 'center',
            marginLeft: 16,
            marginRight: 16,
            borderRadius: 16,
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: 16 }}>Is Visible In Store</span>
          <Switch onChange={this.toggleProductVisibility.bind(this)} checked={this.state.formData.isVisible} />
        </div>
        <div style={{ height: 8 }} />
        <BaseInput
          onChange={this.onChangeInput}
          keyId="title"
          label="Title"
          value={this.state.formData.title ? this.state.formData.title : null}
          validate={this.basicTextValidate.bind(this, 3)}
          error={this.state.errors.title}
        />
        <BaseInput
          onChange={this.onChangeInput}
          multiline
          keyId="description"
          label="Description"
          value={this.state.formData.description ? this.state.formData.description : null}
          validate={this.basicTextValidate.bind(this, 30)}
          error={this.state.errors.description}
        />
        <div style={{ flexDirection: 'row', marginTop: 16, marginBottom: 16, display: 'flex' }}>
          <CheckBoxInput
            value={this.state.formData.isOrganic}
            label="Organic"
            onValueChange={this.toggleSelection.bind(this, 'isOrganic')}
            error={this.state.isOrganicSelectedError}
          />
          <CheckBoxInput
            value={this.state.formData.isArtificial}
            label="Artificial (Faux)"
            onValueChange={this.toggleSelection.bind(this, 'isArtificial')}
            error={this.state.isArtificialSelectedError}
          />
        </div>
        {productVariationToggleContent}
        <span style={marginLabelStyle}>{this.state.errors.variations}</span>
        {variationsView}
        <NSelect
          items={this.props.allProductCategories}
          itemIdKey="_id"
          values={this.state.formData.categories}
          title="Product Categories"
          itemTitleKey="title"
          placeholderText="Select categories..."
          newItems={this.state.formData.isShopOwnerNewValues}
          error={this.state.errors.categories}
          onChangeNewItems={this.onNSelectChangeNewItems.bind(this, 'categories')}
          onChangeItems={(values) => {
            this.onMultiSelectItemsChange('categories', values);
          }}
        />
        <NSelect
          items={this.props.allProductTags}
          values={this.state.formData.productTags ? this.state.formData.productTags : []}
          itemIdKey="_id"
          itemTitleKey="title"
          title="Product Tags"
          placeholderText="Select tags..."
          searchEnabled
          error={this.state.errors.productTags}
          newItems={this.state.formData.isShopOwnerNewValues}
          onChangeNewItems={this.onNSelectChangeNewItems.bind(this, 'productTags')}
          onChangeItems={(values) => {
            this.onMultiSelectItemsChange('productTags', values);
          }}
        />
      </form>
    );
  }

  renderSearchMetaData() {
    // add a new field
    const metaDataTags = this.props.productSearchMetaDataTags;
    const metaNSelects = [];
    for (const key in metaDataTags) {
      const renderItem=({item}) => {
        const hex = item.metaData ? item.metaData.hex : '#fff'
            return (
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <div style={{height: 20, width: 20, alignItems: 'center', marginRight: 8, borderRadius: 16, backgroundColor: hex}} />
                <span>{item.title}</span>
              </div>);
      }
      metaNSelects.push(
        <div>
          <div style={{ marginLeft: 16, marginTop: 16 }}>
            <span style={{ fontWeight: 'bold' }}>{key}</span>
            <br />
            <span style={{ fontSize: 12 }}>{searchMetaDataTags[key]}</span>
          </div>
          <NSelect
            items={metaDataTags[key]}
            values={this.state.formData.metaData ? this.state.formData.metaData[key] : []}
            itemIdKey="_id"
            itemTitleKey="title"
            title={key}
            renderItem={key === 'color' ? renderItem : null}
            placeholderText={`Select ${key}...`}
            searchEnabled
            error={this.state.errors[`metaData$${key}`]}
            onChangeItems={this.onNSelectChangeMetaDataItems.bind(this, `${key}`)}
          />
        </div>,
      );
    }
    return (
      <div>
        <div style={{ marginLeft: 16, marginRight: 16 }}>
          {' '}
          Please add only the relevant tags for your product as they will go through review by our seller success team.
          The more search meta data and tags you add, the more likely your product will appear to customers. These are
          all optional, but we recommend you fill out the ones relevant for the product for more business.
        </div>
        {metaNSelects}
      </div>
    );
  }

  renderInventoryAndPricing() {
    return (
      <div>
        <form>
          <BaseInput
            onChange={this.onChangeInput}
            keyId="quantity"
            label="Quantity"
            widthFactor={3}
            error={this.state.quantityError}
          />
          <BaseInput
            onChange={this.onChangeInput}
            keyId="price"
            label="Price"
            widthFactor={3}
            error={this.state.priceError}
          />
          <BaseInput
            onChange={this.onChangeInput}
            keyId="sku"
            label="SKU"
            widthFactor={3}
            error={this.state.skuError}
          />
        </form>
      </div>
    );
  }

  renderShippingAndFulfillment() {
    return (
      <div>
        <form>
          <NSelect
            items={PROCESSING_TIME_VALUES}
            isSingleSelect
            title="Processing & Fulfillment Time"
            itemIdKey="id"
            itemTitleKey="value"
            hideSelectedTags
            placeholderText="Select time..."
            values={this.state.formData.processingTime ? this.state.formData.processingTime : null}
            error={this.state.errors.processingTime}
            onChangeItems={this.onChangeInput.bind(this, 'processingTime')}
          />
          <br />
          <BaseInput
            onChange={this.onChangeInput}
            keyId="originZipCode"
            label="Origin Zip Code"
            value={this.state.formData.originZipCode ? this.state.formData.originZipCode : null}
            widthFactor={1}
            validate={isZipCodeValid}
            error={this.state.errors.originZipCode}
          />
          {/* <CheckBoxInput
            value={this.state.formData.offerFreeShipping}
            label="Offer Free Shipping"
            onValueChange={this.toggleSelection.bind(this, 'offerFreeShipping')}
            error={this.state.offerFreeShippingError}
          /> */}
          <div style={{ height: 16 }} />
          <span
            style={{
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 16,
              marginBottom: 16,
              marginLeft: 16,
            }}
          >
            Item Weight
          </span>
          <div style={{ display: 'flex', flexDirection: 'row', marginTop: 16 }}>
            <BaseInput
              onChange={this.onChangeInput}
              keyId="itemWeightLb"
              label="Lbs"
              keyboardType="numeric"
              value={this.state.formData.itemWeightLb ? this.state.formData.itemWeightLb : null}
              widthFactor={2}
              validate={isNumberValid}
              error={this.state.errors.itemWeightLb}
            />
            <BaseInput
              onChange={this.onChangeInput}
              keyId="itemWeightOz"
              keyboardType="numeric"
              label="Oz"
              value={this.state.formData.itemWeightOz ? this.state.formData.itemWeightOz : null}
              validate={isNumberValid}
              widthFactor={2}
              error={this.state.errors.itemWeightOz}
            />
          </div>
          <span
            style={{
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 16,
              marginBottom: 16,
              marginLeft: 16,
            }}
          >
            Item Size (Packed)
          </span>
          <div style={{ display: 'flex', flexDirection: 'row', marginTop: 16 }}>
            <BaseInput
              onChange={this.onChangeInput}
              keyId="itemHeightIn"
              label="Height (In)"
              keyboardType="numeric"
              validate={isNumberValid}
              value={this.state.formData.itemHeightIn ? this.state.formData.itemHeightIn : null}
              widthFactor={3}
              error={this.state.errors.itemHeightIn}
            />
            <BaseInput
              onChange={this.onChangeInput}
              keyId="itemWidthIn"
              label="Width (In)"
              keyboardType="numeric"
              validate={isNumberValid}
              widthFactor={3}
              value={this.state.formData.itemWidthIn ? this.state.formData.itemWidthIn : null}
              error={this.state.errors.itemWidthIn}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <BaseInput
              onChange={this.onChangeInput}
              keyId="itemLengthIn"
              validate={isNumberValid}
              label="Length (In)"
              keyboardType="numeric"
              value={this.state.formData.itemLengthIn ? this.state.formData.itemLengthIn : null}
              widthFactor={3}
              error={this.state.errors.itemLengthIn}
            />
          </div>
        </form>
      </div>
    );
  }

  render() {
    if (this.state.isLoading || this.props.isLoadingSellerProduct) {
      return (
        <div>
          <div style={{position: 'absolute', display: 'flex', height: '100%', width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',backgroundColor: 'white', borderRadius: 16}}>
              <ClipLoader
                size={45}
                color="blue"
                loading={this.state.isSavingProduct}/>
                <br/>
              <span>Loading...</span>
            </div>
          </div>
        </div>
      );
    }
    if (this.state.isSavingProduct) {
      return (
        <div>
          <div style={{position: 'absolute', display: 'flex', height: '100%', width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{padding: 8, backgroundColor: 'white', borderRadius: 16}}>
              <ClipLoader
                size={45}
                color="blue"
                loading={this.state.isSavingProduct}/>
            </div>
            <div style={{padding: 8, backgroundColor: 'white', borderRadius: 16}}>
              <b>DO NOT CLOSE this modal.</b> Please wait until we upload your entire product. May take a little longer than expected. 
            </div>
          </div>
        </div>
      );
    }

    const labelStyle = this.state.errors.root !== ""
      ? BrandStyles.components.inputBase.errorLabel
      : BrandStyles.components.inputBase.label;
    return (
      <div style={{ marginLeft: 32, marginRight: 32, maxWidth: 800, margin: 'auto' }}>
        <div style={{ height: 64 }} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            minHeight: 48,
          }}
        >
          <NButton size="x-small" style={{ width: 64 }} title="Close" theme="secondary" onClick={this.onCloseView.bind(this)} />
          <NButton size="x-small" style={{ width: 64 }} title="Save" onClick={this.onSaveProduct.bind(this)} />
        </div>
        <div
          enableResetScrollToCoords={false}
          behavior="padding"
          keyboardShouldPersistTaps="handled"
          keyboardVerticalOffset={30}
        >
          <div>
            <span style={labelStyle}>{this.state.errors.root}</span>
            <br />
            <br />
            <h3
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              {' '}
              Product Basics{' '}
            </h3>

            {this.renderProductBasics()}
            <br />
            <br />
            <h3
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              {' '}
              Search Meta Data{' '}
            </h3>
            {this.renderSearchMetaData()}
            <br />
            <br />
            <h3
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              Shipping & Fulfillment
            </h3>
            {this.renderShippingAndFulfillment()}
            {this.renderProductVariantModal()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  allProductCategories: state.seller.allProductCategories,
  allProductTags: state.seller.allProductTags,
  productSearchMetaDataTags: state.products.productSearchMetaDataTags,
  user: state.auth,
  stores: state.stores.stores,
});

const actions = {
  logOut: logoutFirebase,
  setOnBoardingStepId,
  createProduct,
  updateProduct,
  loadSellerProduct,
  getProductSearchMetaData,
  clearTagsAndCategories,
  createTestProduct,
  loadAllTags: loadAllProductTags,
  loadAllCategories: loadAllProductCategories,
  clearSellerProductCache: clearSellerCurrentProductCache,
   getSellerProducts
};

export default connect(mapStateToProps, actions)(AddProductView);
