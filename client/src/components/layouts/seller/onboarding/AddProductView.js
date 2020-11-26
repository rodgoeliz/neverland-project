import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
import Switch from 'react-switch';
//import ImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';

import BrandStyles from '../../../BrandStyles';
import ClipLoader from "react-spinners/ClipLoader";

import BaseInput from '../../../UI/BaseInput';
import Modal from 'react-modal';
import CheckBoxInput from '../../../UI/CheckBoxInput';
import NSelect from '../../../UI/NSelect';
import {FaPhotoVideo, FaRegEdit} from 'react-icons/fa';
import { GrFormClose } from 'react-icons/gr';

import {
  clearSellerCurrentProductCache,
  loadAllProductCategories,
  loadAllProductTags,
  loadSellerProduct,
  clearTagsAndCategories
} from '../../../../actions/seller';
import { setOnBoardingStepId, logoutFirebase } from "../../../../actions/auth";
import { createProduct, createTestProduct, updateProduct } from '../../../../actions/products';

import AddProductVariationView from './AddProductVariationView';
import NButton from '../../../UI/NButton';

import isZipCodeValid from '../../../../utils/zipcodeValidator';
import isNumberValid from '../../../../utils/numberValidator';

const PROCESSING_TIME_VALUES = [
  { id: 'twenty-four-hours', value: '24 Hrs' },
  { id: 'two-three-days', value: '2-3 days' },
  { id: 'three-five-days', value: '3-5 days' },
  { id: 'one-two-weeks', value: '1-2 weeks' },
  { id: 'more-than-two-weeks', value: '2+ weeks' },
];

const IMAGE_PICKER_ACTION_SHEET = ['Select from gallery', 'Take a photo', 'Cancel'];
// if the product variations have price varied -> then it's "additional" pricing to main price
// means we want to display the main price field - always
//  if sku and quantity varies, then display individual sku and quantity fields, otherwise display main quantity and sku field
// a
{
  /*
  formData: {
    processingTime
    originZipCode
    handlingFee
    offerFreeShipping
    itemWeightLb
    itemWeightOz
    itemHeightIn
    itemWidthIn
    itemLengthIn
    primaryColor
    secondaryColor
    quantity
    price
    sku
    categorySelectedItems
    tagSelectedItems
    isArtifical
    isOrganic
    productPhotos
    title
    description
  }
*/
}

class AddProductView extends Component {
  constructor(props) {
    super(props);
    let { variations } = props;
    if (!variations) {
      variations = [];
    }
    let formDataBase = {
      productPhotos: [],
      productPhotosData: [],
      variations: variations,
      variationFormData: {},
      isVisible: true,
      isProductVariationsVisible: false,
      errors:{}
    };
    function toValue(key, value) {
      return { [key]: value };
    }
    function getProcessingTime(id) {
      for (let i = 0; i < PROCESSING_TIME_VALUES.length; i++) {
        let ptValue = PROCESSING_TIME_VALUES[i];
        if (ptValue.id === id) {
          return ptValue;
        }
      }
    }
    let formData = {};
    // means we are editing the product;
    if (props.product) {
      let product = props.product;
      let transformedVariations = [];
      let variations = product.variationIds;
      for (const idx in variations) {
        let variation = variations[idx];
        let transformedOptions = [];
        for (const jdx in variation.optionIds) {
          let option = variation.optionIds[jdx];
          if (option.price) {
            option.price = option.price.value / 100;
          }
          transformedOptions.push(option);
        }
        variation.options = transformedOptions;
        transformedVariations.push(variation);
      }
      let transformedProductPhotos = product.imageURLs.map((imageURL) => {
        return { sourceURL: imageURL };
      });
      formData = {
        title: product.title,
        description: product.description,
        handle: product.handle,
        itemHeightIn: product.heightIn.toString(),
        itemWidthIn: product.widthIn.toString(),
        itemLengthIn: product.lengthIn.toString(),
        itemWeightLb: product.weightLb.toString(),
        itemWeightOz: product.weightOz.toString(),
        productSKU: product.sku,
        isVisible: product.isVisible,
        isArtificial: product.isArtificial ? product.isArtificial : false,
        isOrganic: product.isOrganic ? product.isOrganic : false,
        processingTime: [getProcessingTime(product.processingTime)],
        originZipCode: product.originZipCode,
        handlingFee: [product.handlingFee],
        offerFreeShipping: product.offerFreeShipping ? product.offerFreeShipping : false,
        colors: product.colors,
        benefit: product.benefit,
        style: product.style,
        productPhotos: transformedProductPhotos,
        productPhotosData: transformedProductPhotos,
        variations: transformedVariations,
        productTags: product.tagIds,
        categories: product.categoryIds,
        isProductVariationsVisible: transformedVariations.length > 0,
      };
      if (product.price && product.price.value) {
        const transformedValue = product.price.value / 100;
        formData.productPrice = transformedValue.toString();
      }
      if (product.inventoryInStock) {
        formData.productQuantity = product.inventoryInStock.toString();
      }
    }
    let updatedFormData = {
      ...formDataBase,
      ...formData,
    };
    this.state = {
      isProductVariantModalVisible: false,
      allTags: props.allProductTags,
      formData: updatedFormData,
      errors: {}
    };
    //props.onChange(this.state);
    this.onPressChoosePhoto = this.onPressChoosePhoto.bind(this);
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
    this.onPressAddPhotoSheetOption = this.onPressAddPhotoSheetOption.bind(this);
    this.onImageFileChange = this.onImageFileChange.bind(this);
  }
  async initTags() {
    await this.props.loadAllTags();
    await this.props.loadAllCategories();
    this.setState({
      isLoading: false,
    });
  }

  async componentDidMount() {
    if (
      !this.props.allProductCategories ||
      !this.props.allProductTags ||
      this.props.allProductCategories.length == 0 ||
      this.props.allProductTags.length == 0
    ) {
      this.setState(
        {
          isLoading: true,
        },
        this.initTags.bind(this),
      );
    }
    //console.log("creating test product", this.props.createTestProduct)
    // means we are editing a product, so we must pull it
    if (this.props.productId) {
      await this.props.loadSellerProduct({ productId: this.props.productId });
    } else {
      this.props.clearSellerProductCache();
    }
  }
  transformToFormData(jsonObj, formData) {
    for (const key in jsonObj) {
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
        case 'processingTime':
          const processingTime = jsonObj[key];
          if (processingTime.length > 0) {
            formData.append(key, processingTime[0]['id']);
          }
          break;
        default:
          formData.append(key, jsonObj[key]);
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
        //this.props.onChange(this.state);
      },
    );
  }

  onChangeInput(key, value) {
    let newFormData = { ...this.state.formData };
    newFormData[key] = value;
    this.updateFormData(newFormData);
    // this props on change product input
  }


  onSaveProduct() {
    this.onSubmitProduct();
  }

  onPressAddPhoto() {}

  addPhotosToFormData(photosArr) {
    let newFormData = { ...this.state.formData };
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
    let newFormData = { ...this.state.formData };
    let photos = newFormData.productPhotosData;
    if (!photos) {
      photos = photosArr;
    } else {
      photos = photos.concat(photosArr);
    }
    newFormData.productPhotosData = photos;
    this.updateFormData(newFormData);
  }

  onPressAddPhotoSheetOption(buttonIndex) {
    if (buttonIndex === 0) {
      {/*ImagePicker.openPicker({
        multiple: true,
      }).then((images) => {
        this.addPhotosToState(images);
      });*/}
    } else if (buttonIndex === 1) {
      /*ImagePicker.openCamera({}).then((image) => {
        const transformedImage = {
          sourceURL: image.path,
          mime: image.mime,
          width: image.width,
          height: image.height,
          size: image.size,
        };
        this.addPhotosToState([transformedImage]);
      });*/
    }
    //this.setState({ actionSheetIdx: buttonIndex });
  }

  onPressChoosePhoto() {

    //open action sheet
    /*ActionSheet.show(
      {
        options: IMAGE_PICKER_ACTION_SHEET,
        cancelButtonIndex: IMAGE_PICKER_ACTION_SHEET.length - 1,
        title: 'Add product photo',
      },
      this.onPressAddPhotoSheetOption,
    );*/
  }

  validateInput() {
    let errors = this.state.errors;
    if (!this.state.formData) {
      errors['root'] = 'Please complete the form.';
      this.setState({ errors });
      return;
    } else {
      errors['root'] = '';
    }

    if (this.state.formData.isProductVariationsVisible) {
      let variations = this.state.formData.variations;
      if (variations && variations.length === 0) {
        errors['variations'] = 'Please add variations or toggle off.';
      } else {
        errors['variations'] = '';
      }
    }

    if (!this.state.formData.isProductVariationsVisible) {
      let productPrice = this.state.formData.productPrice;
      if (!productPrice || !productPrice.productPrice || productPrice.productPrice.length < 1) {
        errors['productPrice'] = 'Enter a valid price.';
      } else {
        errors['productPrice'] = '';
      }
      let productQuantity = this.state.formData.productQuantity;
      if (
        !productQuantity ||
        !productQuantity.productQuantity ||
        productQuantity.productQuantity.length < 1
      ) {
        errors['productQuantity'] = 'Enter a valid quantity.';
      } else {
        errors['productQuantity'] = '';
      }
      let productSKU = this.state.formData.productSKU;
      if (!productSKU || !productSKU.productSKU || productSKU.productSKU.length < 3) {
        errors['productSKU'] = 'Enter a valid SKU.';
      } else {
        errors['productSKU'] = '';
      }
    }

    let title = this.state.formData.title;
    if (!title || !title.title || title.title.length < 3) {
      errors['title'] = 'Please enter a title.';
    } else {
      errors['title'] = '';
    }

    let description = this.state.formData.description;
    if (!description || !description.description || description.description.length === 0) {
      errors['description'] = 'Please enter a description.';
    } else {
      errors['description'] = '';
    }

    // productTags
    let productTags = this.state.formData.productTags;
    if (!productTags || productTags.length === 0) {
      errors['productTags'] = 'Please select at least one product tag.';
    } else {
      errors['productTags'] = '';
    }
    let categories = this.state.formData.categories;
    if (!categories || categories.length === 0) {
      errors['categories'] = 'Please select at least one category.';
    } else {
      errors['categories'] = '';
    }

    let processingTime = this.state.formData.processingTime;
    if (!processingTime || processingTime.length === 0) {
      errors['processingTime'] = 'Please select a processing time.';
    } else {
      errors['processingTime'] = '';
    }

    let itemHeightIn = this.state.formData.itemHeightIn;
    if (
      !itemHeightIn ||
      !itemHeightIn.itemHeightIn ||
      itemHeightIn.hasError ||
      itemHeightIn.itemHeightIn.length === 0
    ) {
      errors['itemHeightIn'] = 'Please enter item height.';
    } else {
      errors['itemHeightIn'] = '';
    }
    let itemLengthIn = this.state.formData.itemLengthIn;
    if (
      !itemLengthIn ||
      !itemLengthIn.itemLengthIn ||
      itemLengthIn.hasError ||
      itemLengthIn.itemLengthIn.length === 0
    ) {
      errors['itemLengthIn'] = 'Please enter item length.';
    } else {
      errors['itemLengthIn'] = '';
    }
    let itemWeightLb = this.state.formData.itemWeightLb;
    if (
      !itemWeightLb ||
      !itemWeightLb.itemWeightLb ||
      itemWeightLb.hasError ||
      itemWeightLb.itemWeightLb.length === 0
    ) {
      errors['itemWeightLb'] = 'Please enter item weight.';
    } else {
      errors['itemWeightLb'] = '';
    }
    let itemWeightOz = this.state.formData.itemWeightOz;
    if (
      !itemWeightOz ||
      !itemWeightOz.itemWeightOz ||
      itemWeightOz.hasError ||
      itemWeightOz.itemWeightOz.length === 0
    ) {
      errors['itemWeightOz'] = 'Please enter item weight (oz).';
    } else {
      errors['itemWeightOz'] = '';
    }
    let itemWidthIn = this.state.formData.itemWidthIn;
    if (
      !itemWidthIn ||
      !itemWidthIn.itemWidthIn ||
      itemWidthIn.hasError ||
      itemWidthIn.itemWidthIn.length === 0
    ) {
      errors['itemWidthIn'] = 'Please enter item width (in).';
    } else {
      errors['itemWidthIn'] = '';
    }

    let productPhotos = this.state.formData.productPhotos;
    if (!productPhotos || productPhotos.length === 0) {
      errors['productPhotos'] = 'Please select product photos.';
    } else {
      errors['productPhotos'] = '';
    }

    let originZipCode = this.state.formData.originZipCode;
    if (
      !originZipCode ||
      !originZipCode.originZipCode ||
      originZipCode.hasError ||
      originZipCode.originZipCode.length === 0
    ) {
      errors['originZipCode'] = 'Please enter zip code.';
    } else {
      errors['originZipCode'] = '';
    }

    let variations = this.state.formData.variations;

    this.setState({
      errors,
    });
  }

  async saveProduct() {
    let currentProduct = this.props.product ? this.props.product : this.props.currentSellerProduct;
    /*let valid = this.validateInput();
    if (!valid) {
      return;
    }*/
    let formData = new FormData();
    //formData.append('my_photos')
    for (let i = 0; i < this.state.formData.productPhotos.length; i++) {
      let photo = this.state.formData.productPhotos[i];
      formData.append(`productImageFile[${i}]`, photo);
     /* {
        uri: photo.sourceURL,
        type: photo.mime,
        name: this.state.formData.title + '-' + this.props.user._id + 'productImage' + i,
      });*/
    }
    formData = this.transformToFormData(this.state.formData, formData);
    formData.append('userId', this.props.user._id);
    formData.append('storeId', this.props.user.storeId._id);
    let existingProduct = null; 
    if (this.props.route) {
      const existingProduct =
        this.props.product ?? this.props.currentSellerProduct ?? this.props.route.params
          ? this.props.route.params.product
          : null;
    }

    if (existingProduct) {
      formData.append('productId', existingProduct._id);
      await this.props.updateProduct({ formData });
      this.props.navigation.goBack();
      return;
    }

    await this.props.createProduct({ formData });
    this.setState({ isSavingProduct: false });
    this.onCloseView();
  }

  async onSubmitProduct() {
    this.setState({ isSavingProduct: true });
    this.saveProduct();
  }

  onChange(formData) {
    let errors = this.state.errors;
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
        console.log('Updated onChange for FormData', this.state);
      },
    );
  }

  onCloseView() {
    this.props.onClose();
  }

  toggleSelection(key) {
    let newFormData = { ...this.state.formData };
    newFormData[key] = !newFormData[key];
    this.setState(
      {
        formData: newFormData,
      },
      () => {
        //this.onChange(this.state);
      },
    );
  }

  removeImageUrl(productPhoto) {
    let newFormData = { ...this.state.formData };
    let productPhotos = newFormData.productPhotosData;
    let index = productPhotos.findIndex((product) => {
      return product == productPhoto;
    });
    productPhotos.splice(index, 1);
    newFormData.productPhotosData = productPhotos;
    this.setState(
      {
        formData: newFormData,
      },
      () => {
        //this.props.onChange(this.state);
      },
    );
  }

  onImageFileChange(e) {
    let promises =[];
    Array.from(e.target.files).forEach((file) => {
      var url = new Promise(resolve => {
        let reader = new FileReader();
        if (file && file.type.match('image.*')) {
          try {

          reader.readAsDataURL(file);
          reader.onloadend = function (e) {
            resolve(reader.result);
          };
          }catch(error) {
            console.log("ERROR", error)
          }
        }
    });
        promises.push(url);
    });
    let origFiles = e.target.files;
    Promise.all(promises).then(files => {
      this.addPhotosToState(files);
      this.addPhotosToFormData(origFiles);
    });
  }

  renderChosenPhotos() {
    let photos = this.state.formData.productPhotosData;
    let spanStyle = {...BrandStyles.components.iconPlaceholder, marginBottom: 16, paddingTop: 16};
    if (photos.length === 0) {
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
          <span
            style={spanStyle}
          >
            {' '}
            Add photos to get started{' '}
          </span>
          <input type="file" onChange={this.onImageFileChange} multiple />
        </div>
      );
    }
    let productPhotoViews = [];
    let iconStyle = {...BrandStyles.components.iconPlaceholder, color: BrandStyles.color.xdarkBeige};
    photos.map((product) => {
      productPhotoViews.push(
        <div style={{position: 'relative'}}>
          <div
            onClick={this.removeImageUrl.bind(this, product)}
            style={{
              position: 'absolute',
              top: 10,
              right: 16,
              zIndex: 100,
              padding: 2,
              borderRadius: 100,
              backgroundColor: BrandStyles.color.beige,
            }}
          >
            <GrFormClose style={iconStyle} />
          </div>
          <img
            src={product.sourceURL ? product.sourceURL : product}
            style={{
              width: 100,
              height: 100,
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
        <span> Add Photos </span>
          <input type="file" onChange={this.onImageFileChange} multiple />
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
    let newFormData = { ...this.state.formData };
    newFormData.variationFormData = variationState;

    this.setState(
      {
        formData: newFormData,
      },
      () => {
        this.onRequestProductVariantModalClose();
        //this.props.onChange(this.state);
      },
    );
  }

  onChangeVariations(variations) {
    let newFormData = { ...this.state.formData };
    newFormData.variations = variations;
    this.setState(
      {
        formData: newFormData,
      },
      () => {
        //this.props.onChange(this.state);
      },
    );
  }

  onMultiSelectItemsChange(key, values) {
    let newFormData = { ...this.state.formData };
    newFormData[key] = values;

    this.setState(
      {
        formData: newFormData,
      },
      () => {
        //this.props.onChange(this.state);
      },
    );
  }

  renderProductVariantModal() {
    return (
      <div>
        <Modal
          animationType="slide"
          transparent={false}
          presentationStyle={'fullScreen'}
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
    let newFormData = { ...this.state.formData };
    let variations = this.state.formData.variations;
    if (!variations) {
      return false;
    }

    let updatedVariations = [];
    for (let i = 0; i < variations.length; i++) {
      let variation = variations[i];
      let options = variation.options;
      for (let j = 0; j < options.length; j++) {
        let option = options[j];
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
        //this.props.onChange(this.state);
      },
    );
  }

  setEditingState(optionSlug, key, value) {
    let newFormData = { ...this.state.formData };
    let variations = this.state.formData.variations;
    if (!variations) {
      return false;
    }
    let updatedVariations = [];
    for (let i = 0; i < variations.length; i++) {
      let variation = variations[i];
      let options = variation.options;
      for (let j = 0; j < options.length; j++) {
        let option = options[j];
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
        //this.props.onChange(this.state);
      },
    );
  }

  toggleProductVariationsVisibility() {
    let newFormData = { ...this.state.formData };
    newFormData.isProductVariationsVisible = !newFormData.isProductVariationsVisible;
    this.setState(
      {
        formData: newFormData,
      },
      () => {
        //this.props.onChange(this.state);
      },
    );
  }

  toggleProductVisibility() {
    let newFormData = { ...this.state.formData };
    newFormData.isVisible = !newFormData.isVisible;
    this.setState(
      {
        formData: newFormData,
      },
      () => {
        //this.props.onChange(this.state);
      },
    );
  }

  toggleVisibility(optionSlug, key) {
    let newFormData = { ...this.state.formData };
    let variations = newFormData.variations;
    if (!variations) {
      return;
    }
    for (var i = 0; i < variations.length; i++) {
      let variation = variations[i];
      let options = variation.options;
      for (var j = 0; j < options.length; j++) {
        let option = options[j];
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
        //this.props.onChange(this.state);
      },
    );
  }

  getEditingState(optionSlug, key) {
    let variations = this.state.formData.variations;
    if (!variations) {
      return false;
    }
    for (var i = 0; i < variations.length; i++) {
      let variation = variations[i];
      let options = variation.options;
      for (var j = 0; j < options.length; j++) {
        let option = options[j];
        if (option.handle === optionSlug) {
          return option[key];
        }
      }
    }
  }

  renderProductVariationsTable() {
    let variations = this.state.formData.variations;
    let variationEditableViews = [];
    let labelStyle = BrandStyles.components.inputBase.label;
    if (variations) {
      variations.map((variation) => {
        let skuVaried = variation.isSKUVaried;
        let visible = variation.isVisible;
        let priceVaried = variation.isPriceVaried;
        let quantityVaried = variation.isQuantityVaried;
        let options = variation.options;
        let editableOptionViews = [];
        let iconStyle = {...BrandStyles.components.iconPlaceholder,...styles.iconSpacing};
        let spanStyle = {...labelStyle, marginLeft: 4};
        let spanEditStyle = {...labelStyle, ...styles.optionEditLabel};
        if (options) {
          for (var i = 0; i < options.length; i++) {
            let option = options[i];
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
                    <span style={spanStyle}>{'Is Visible'}</span>
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
                            <span style={spanEditStyle}>{'SKU'}</span>
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
                            <span style={spanEditStyle}>{'SKU'}</span>
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
                    <div/>
                  )}
                  {priceVaried ? (
                    <div style={{ flex: 1, margin: 4 }}>
                      {this.getEditingState(option.handle, 'isEditingPrice') ? (
                        <div style={styles.optionEditContainer}>
                          <div style={styles.optionEditContentWrapper}>
                            <span style={spanEditStyle}>
                              {'Additional Cost'}
                            </span>
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
                            <span style={spanEditStyle}>
                              {'Additional Cost'}
                            </span>
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
                            <span style={spanEditStyle}>{'Quantity'}</span>
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
                            <span style={spanEditStyle}>{'Quantity'}</span>
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
            <span style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
              {variation.title}
            </span>
            {editableOptionViews}
          </div>,
        );
      });
    }
    return variationEditableViews;
  }

  onNSelectChangeNewItems(key, newValues) {
    let formData = this.state.formData;
    formData[key] = newValues;
    this.setState({
      formData,
    });
  }

  basicTextValidate(minChar, value) {
    return !(!value || value.length < minChar);
  }

  checkVariationEnabled(key) {
    let variations = this.state.formData.variations;
    let isVariationKeyEnabled = false;
    for (var i in variations) {
      let variation = variations[i];
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
    let pvBaseInfoViews = [];
    pvBaseInfoViews.push(
      <BaseInput
        onChange={this.onChangeInput}
        keyId="productPrice"
        label="Base Price"
        full
        value={this.state.formData.productPrice ? this.state.formData.productPrice : null}
        validate={this.basicTextValidate.bind(this, 2)}
        error={this.state.errors['productPrice']}
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
          error={this.state.errors['productSKU']}
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
          error={this.state.errors['productQuantity']}
        />,
      );
    }
    return <div style={{ display: 'flex', flexDirection: 'column' }}>{pvBaseInfoViews}</div>;
  }

  renderProductBasics() {
    let existingVariations = this.state.formData.variations;
    let variationsView = null;
    let isExistingVariations = existingVariations && existingVariations.length !== 0;
    // render toggle switch
    let hasVariationsToggle = (
      <Switch
        onChange={this.toggleProductVariationsVisibility.bind(this)}
        checked={this.state.formData.isProductVariationsVisible}
      />
    );
    let productVariationsToggle = (
      <div
        style={{
          backgroundColor: BrandStyles.color.warmlightBeige,
          marginLeft: 16,
          marginRight: 16,
          marginBottom: 16,
          borderRadius: 16,
        }}
      >
        <span
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            textAlign: 'center',
            padding: 16,
          }}
        >
          Pricing & Product Variations
        </span>
        <div
          style={{
            display: 'flex',
            paddingLeft: 16,
            paddingRight: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 16,
            paddingBottom: 16,
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: 16 }}>Has product variations</span>
          {hasVariationsToggle}
        </div>
      </div>
    );
    let productVariationToggleContent = this.genMainProductVariationBaseInfoTable();
    //if (!this.state.formData.isProductVariationsVisible) {
    //variationsView = productVariationToggleContent;
    //} else {
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
          }}
        >
          <span style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
            {' '}
            Product Variations{' '}
          </span>
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
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <span style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
                {' '}
                Product Variations{' '}
              </span>
              <span style={{ textAlign: 'center' }}>
                {' '}
                Add new product variations (color, size, etc){' '}
              </span>
            </div>
            <NButton title="Add Variations" onClick={this.openProductVariantModal} />
          </div>
        </div>
      );
    }
    //}

    let labelStyle = this.state.errors['variations']
      ? BrandStyles.components.inputBase.errorLabel
      : BrandStyles.components.inputBase.label;
    let errorLabelStyle = {...BrandStyles.components.inputBase.errorLabel, textAlign: 'center'};
    let marginLabelStyle = {...labelStyle, marginLeft: 16};
    return (
      <form>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
            {' '}
            Product Photos{' '}
          </span>
          <span style={errorLabelStyle}>
            {this.state.errors['productPhotos']}
          </span>
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
          <Switch
            onChange={this.toggleProductVisibility.bind(this)}
            checked={this.state.formData.isVisible}
          />
        </div>
        <div style={{ height: 8 }} />
        <BaseInput
          onChange={this.onChangeInput}
          keyId="title"
          label="Title"
          value={this.state.formData.title ? this.state.formData.title : null}
          validate={this.basicTextValidate.bind(this, 3)}
          error={this.state.errors['title']}
        />
        <BaseInput
          onChange={this.onChangeInput}
          multiline={true}
          keyId="description"
          label="Description"
          value={this.state.formData.description ? this.state.formData.description : null}
          validate={this.basicTextValidate.bind(this, 30)}
          error={this.state.errors['description']}
        />
        <div style={{ flexDirection: 'row', marginTop: 16, marginBottom: 16, display: 'flex'}}>
          <CheckBoxInput
            value={this.state.formData.isOrganic}
            label={'Organic'}
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
        <span style={marginLabelStyle}>{this.state.errors['variations']}</span>
        {variationsView}
        <NSelect
          items={this.props.allProductCategories}
          itemIdKey="_id"
          values={this.state.formData.categories}
          title="Product Categories"
          itemTitleKey="title"
          placeholderText={'Select categories...'}
          newItems={this.state.formData.isShopOwnerNewValues}
          error={this.state.errors['categories']}
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
          placeholderText={'Select tags...'}
          searchEnabled={true}
          error={this.state.errors['productTags']}
          newItems={this.state.formData.isShopOwnerNewValues}
          onChangeNewItems={this.onNSelectChangeNewItems.bind(this, 'productTags')}
          onChangeItems={(values) => {
            this.onMultiSelectItemsChange('productTags', values);
          }}
        />
      </form>
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
            isSingleSelect={true}
            title="Processing & Fulfillment Time"
            itemIdKey="id"
            itemTitleKey="value"
            hideSelectedTags={true}
            placeholderText={'Select time...'}
            values={this.state.formData.processingTime ? this.state.formData.processingTime : null}
            error={this.state.errors['processingTime']}
            onChangeItems={this.onChangeInput.bind(this, 'processingTime')}
          />
          <BaseInput
            onChange={this.onChangeInput}
            keyId="originZipCode"
            label="Origin Zip Code"
            value={this.state.formData.originZipCode ? this.state.formData.originZipCode : null}
            widthFactor={1}
            validate={isZipCodeValid}
            error={this.state.errors['originZipCode']}
          />
          {/*<CheckBoxInput
            value={this.state.formData.offerFreeShipping}
            label="Offer Free Shipping"
            onValueChange={this.toggleSelection.bind(this, 'offerFreeShipping')}
            error={this.state.offerFreeShippingError}
          />*/}
          <div style={{ height: 16 }} />
          <span
            style={{
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 16,
              marginBottom: 16,
            }}
          >
            Item Weight
          </span>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <BaseInput
              onChange={this.onChangeInput}
              keyId="itemWeightLb"
              label="Lbs"
              keyboardType="numeric"
              value={this.state.formData.itemWeightLb ? this.state.formData.itemWeightLb : null}
              widthFactor={2}
              validate={isNumberValid}
              error={this.state.errors['itemWeightLb']}
            />
            <BaseInput
              onChange={this.onChangeInput}
              keyId="itemWeightOz"
              keyboardType="numeric"
              label="Oz"
              value={this.state.formData.itemWeightOz ? this.state.formData.itemWeightOz : null}
              validate={isNumberValid}
              widthFactor={2}
              error={this.state.errors['itemWeightOz']}
            />
          </div>
          <span
            style={{
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 16,
              marginBottom: 16,
            }}
          >
            Item Size (Packed)
          </span>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <BaseInput
              onChange={this.onChangeInput}
              keyId="itemHeightIn"
              label="Height (In)"
              keyboardType="numeric"
              validate={isNumberValid}
              value={this.state.formData.itemHeightIn ? this.state.formData.itemHeightIn : null}
              widthFactor={3}
              error={this.state.errors['itemHeightIn']}
            />
            <BaseInput
              onChange={this.onChangeInput}
              keyId="itemWidthIn"
              label="Width (In)"
              keyboardType="numeric"
              validate={isNumberValid}
              widthFactor={3}
              value={this.state.formData.itemWidthIn ? this.state.formData.itemWidthIn : null}
              error={this.state.errors['itemWidthIn']}
            />
            <BaseInput
              onChange={this.onChangeInput}
              keyId="itemLengthIn"
              validate={isNumberValid}
              label="Length (In)"
              keyboardType="numeric"
              value={this.state.formData.itemLengthIn ? this.state.formData.itemLengthIn : null}
              widthFactor={3}
              error={this.state.errors['itemLengthIn']}
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
          <span>Loading product...</span>
        </div>
      );
    }
    let loader = this.state.isSavingProduct ? (
      <div style={{position: 'absolute', display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{padding: 8, backgroundColor: 'white', borderRadius: 16}}>
          <ClipLoader
            size={45}
            color={'blue'}
            loading={this.state.isSavingProduct}/>
        </div>
      </div>
    ) : null;

    let containerStyle = {...BrandStyles.components.onboarding.container, flexDirection: 'column'};
    return (
      <div>
        <div style={{ height: 64 }} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            minHeight: 48,
          }}
        >
          <div onClick={this.onCloseView.bind(this)}>
            <span>Close</span>
          </div>
          <div onClick={this.onSaveProduct.bind(this)}>
            <span>Save</span>
          </div>
        </div>
        <div
          enableResetScrollToCoords={false}
          behavior="padding"
          keyboardShouldPersistTaps="handled"
          keyboardVerticalOffset={30}
        >
          {loader}
          <div>
            <span>{this.state.errors['root']}</span>
            {this.renderProductBasics()}
            <div style={{ height: 24 }} />
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

const mapStateToProps = (state) => ({
  allProductCategories: state.seller.allProductCategories,
  allProductTags: state.seller.allProductTags,
  user: state.auth 
});

const actions = {
  logOut: logoutFirebase,
  setOnBoardingStepId: setOnBoardingStepId,
  createProduct,
  updateProduct,
  loadSellerProduct,
  clearTagsAndCategories: clearTagsAndCategories,
  createTestProduct: createTestProduct,
  loadAllTags: loadAllProductTags,
  loadAllCategories: loadAllProductCategories,
  clearSellerProductCache: clearSellerCurrentProductCache,
  // getSellerProducts: getSellerProducts
};

export default connect(mapStateToProps, actions) (AddProductView);
