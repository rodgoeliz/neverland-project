import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Redirect} from "react-router-dom";
import NButton from "../../../UI/NButton";
import ProductListItem from "../../../UI/ProductListItem";
import FlatList from "../../../UI/FlatList";
import OnboardingHeader from "./OnboardingHeader";
import AddProductView from "./AddProductView";
import OnboardingImageWrapper from "./OnboardingImageWrapper";
import BrandStyles from "../../../BrandStyles";
import SellerLoadingPage from './SellerLoadingPage';
import Modal from 'react-modal';
import {
  clearSellerCurrentProductCache,
  loadAllProductCategories,
  loadAllProductTags,
  loadSellerProduct,
  clearTagsAndCategories,
  getSellerProducts,
} from '../../../../actions/seller';
import { setOnBoardingStepId, logoutFirebase } from "../../../../actions/auth";
import { createProduct, createTestProduct, updateProduct } from '../../../../actions/products';
import { getNextOnBoardingStepId } from '../../../../utils/helpers';
import screenNames from '../../../../constants/screenNames';

class SellerOnboardingAddProductsPage extends Component {
  constructor(props) {
    super(props);
    let sellerProducts = [];
    if (props.sellerProducts) {
      for (const key in props.sellerProducts) {
        sellerProducts.push(props.sellerProducts[key]);
      }
    }
    this.state = {
      products: sellerProducts,
    };

    this.renderProductItem = this.renderProductItem.bind(this);
    this._closeModal = this._closeModal.bind(this);
  }

  async onSubmitProduct() {
    this.setState({ isSavingProduct: true });
    this.saveProduct();
  }

  async _loadSellerProducts() {
    await this.props.getSellerProducts(this.props.user._id);
    this.setState({isLoading: false});
  } 

  async componentDidMount() {
    this.setState({isLoading: true}, () => {
      this._loadSellerProducts();
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
      formData.append(`productImageFile[${i}]`, {
        uri: photo.sourceURL,
        type: photo.mime,
        name: this.state.formData.title + '-' + this.props.user._id + 'productImage' + i,
      });
    }
    formData = this.transformToFormData(this.state.formData, formData);
    formData.append('userId', this.props.user._id);
    formData.append('storeId', this.props.user.storeId._id);

    const existingProduct =
      this.props.product ?? this.props.currentSellerProduct ?? this.props.route.params
        ? this.props.route.params.product
        : null;

    if (existingProduct) {
      formData.append('productId', existingProduct._id);
      await this.props.updateProduct({ formData });
      this.props.navigation.goBack();
      return;
    }

    await this.props.createProduct({ formData });
    this.setState({ isSavingProduct: false });
    this.props.navigation.goBack();
  }

  onPressAddProduct = () => {
    // popup a modal to add product
    this.setState({
      isAddProductModalVisible: true
    });
  };

  onPressItem = (itemId) => {
    const product = this.props.sellerProducts[itemId];
    this.setState({
      product,
      isAddProductModalVisible: true
    }) 
  };

  _closeModal() {
    this.setState({
      isAddProductModalVisible: false,
    });
  }

  onPressNext = () => {
    this.props.setOnBoardingStepId(getNextOnBoardingStepId(this.props.onboardingStepId, true));
    this.setState({
      toNextStep: true
    });
  };

  renderProductItem({ item }) {
    return <ProductListItem full product={item} onClickItem={this.onPressItem} />;
  }

  render() {
    if (this.state.toNextStep) {
      return (<Redirect to="/seller/onboarding/payment" />);
    }
    const isLoading = this.state.isLoading;
    /*const currentProduct =
      this.props.product ?? this.props.currentSellerProduct ?? this.props.route.params
        ? this.props.route.params.product
        : null;*/
    //let currentProduct = this.props.product ? this.props.product : this.props.currentSellerProduct;
    let sellerProducts = [];
    if (this.props.sellerProducts) {
      for (const key in this.props.sellerProducts) {
        sellerProducts.push(this.props.sellerProducts[key]);
      }
    }
    let nextButton = null;
    // if greater than 3 products, allow to move on
    //if (sellerProducts && sellerProducts.length > 2) {
      if (true) {
        nextButton = <NButton title={'Next Step'} onClick={this.onPressNext} />;
      }
    let containerStyle = {...BrandStyles.components.onboarding.container, justifyContent: 'center', paddingTop: 42};
    if (isLoading) return <SellerLoadingPage />; 
    return (
      <OnboardingImageWrapper>
        <OnboardingHeader />
        <div
          style={containerStyle}
        >
          <div
            enableResetScrollToCoords={false}
            keyboardShouldPersistTaps="handled"
          >
            <div
              style={{
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <h2 style={{ fontWeight: 'bold' }}>Add Products</h2>
              <div style={{ height: 24 }} />
              <span>Please add at least 3 products to your store.</span>
            </div>
            <div style={{ height: 16 }} />
            <div>
              <Modal
                style={{content: {borderRadius: 32, backgroundColor: BrandStyles.color.lightBeige}}}
                isOpen={this.state.isAddProductModalVisible}
                animationType="slide"
                shouldCloseOnOverlayClick={true}
                transparent={false}
                onRequestClose={this._closeModal}
                >
                <AddProductView onChange={this.onChange} onClose={this._closeModal} product={this.state.product}/>
              </Modal>
            </div>
            <NButton onClick={this.onPressAddProduct} title="Add product" />
            {nextButton}
            <FlatList
              extraData={this.state}
              data={sellerProducts}
              renderItem={this.renderProductItem}
              keyExtractor={(item) => item._id}
            />
            <div style={{ height: 64 }} />
          </div>
          {/*<div onClick={this.props.logOut}> <span>Logout</span> </div>*/}
        </div>
      </OnboardingImageWrapper>
    );
  }
}


const mapStateToProps = (state) => ({
  sellerProducts: state.products.sellerProductsCache,
  products: state.products.productsCache,
  onboardingStepId: state.auth.onboardingStepId,
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
  getSellerProducts: getSellerProducts
};

export default connect(mapStateToProps, actions)(SellerOnboardingAddProductsPage);
