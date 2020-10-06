import React, {Component, useState} from 'react';
import { connect } from 'react-redux';
import {Redirect} from "react-router-dom";
import queryString from 'query-string';
import {Accordion, Card, Button, Form} from 'react-bootstrap';
import AccordionCard from "../AccordionCard";
import { createPlant, loadProduct, updateProduct, createProduct, createStore, deleteProduct, loadProductTags, createProductTags, loadUsers, loadProducts, loadStores} from "../../actions/admin";
import Select from 'react-select';
import { useHistory } from "react-router-dom";
import CreatableSelect from 'react-select/creatable';
import DataTable from 'react-data-table-component';
import { List, arrayMove } from 'react-movable';

class AdminProductEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			productUserInputValue: "",
			imageURLs: [],
			productId: ""
		}
		this.onSubmitUpdateProduct = this.onSubmitUpdateProduct.bind(this);
	}

	async componentDidMount() {
		const { match: {params}} = this.props;
		this.props.loadProduct(params.productId);
		this.setState({productId: params.productId})
		this.props.loadProductTags();
		this.props.loadStores();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.product == null && this.props.product) {
			this.setState({
				title: this.props.product.title,
				description: this.props.product.description,
				handle: this.props.product.handle,
				inventoryAvailable: this.props.product.inventoryAvailableToSell,
				storeId: this.props.product.storeSelector,
				price: this.props.product.price,
				tags: this.props.product.tagSelectors
			});
		}
	}

	setImageURLs(imageUrls) {
		this.setState({
			imageURLs: imageUrls
		});
	}
	onClickWaitlist() {
		//validate email
		if (this.validateEmail(this.state.emailInput)) {
			this.props.joinWaitlist(this.state.emailInput, this.state.inviter);
			this.setState({
				"emailError": "",
				isSubmitting: true
			});
		} else {
			this.setState({"emailError": "Please enter valid email"})
		}
		//window.location = "https://docs.google.com/forms/d/e/1FAIpQLSeZcRVCsn-_cOXdcMyjEfR7PQ9N536zi0NGdVZRbcfE4KUCpg/viewform"
	}

	async onSubmitUpdateProduct() {
		const formData = new FormData();

		// update new image files if any
		if (this.state.imageFiles) {
			for (let i = 0; i < this.state.imageFiles.length; i++) {
				formData.append(`imageFile[${i}]`, this.state.imageFiles[i]);
			}
		}
		let tagIds = this.state.tags.map((tag) => {
			return tag.value;
		});
		let storeId = this.state.storeId.value;
		formData.append('title', this.state.title);
		formData.append('description', this.state.description);
		formData.append('handle', this.state.handle);
		formData.append('inventoryAvailable', this.state.inventoryAvailable);
		formData.append('storeId', storeId);
		formData.append('price', this.state.price);
		if (this.state.imageURLs) {
			formData.append('imageURLs', this.state.imageURLs)
		}
		formData.append('productId', this.state.productId);
		formData.append('userId', this.state.userId);
		formData.append('tagIds', tagIds)
		await this.props.updateProduct(formData);
	    window.location.reload(false);
	}

	async onSubmitCreateStore() {
		let store = this.state['store'];
		let productInput = {
			userId: store.userId,
			productIds: store.products
		};
		await this.props.createStore(productInput);
	}

	async onSubmitCreateTags() {
		let tags = this.state['tags'];
		await this.props.createProductTags({tags});
	}

	onSelectInputChange(key, value) {
		this.setState({
			[key]: value.value 
		})
	}

	onTagMultiInputChange(sectionId, values) {
		if (!values) {
			return;
		}
		let section = this.state[sectionId];
		if (!section) {
			section = {}
		}

		let allValues = values.map((value) => {
			return value.value;
		});
		this.setState({
			[sectionId]: allValues
		})
	}
	onMultiInputChange(key, values) {
		let allValues = values.map((value) => {
			return value.value;
		});
		this.setState({
			[key]: values 
		})
	}
	onChangeFileInput(key, event) {
		this.setState({
			[key]: event.target.files
		});
	}
	onChangeInput(key, event) {
		this.setState({
			[key]:event.target.value 
		});
	}

	onEditProductRow(productId) {
		this.setState({
			redirect: true,
			redirectTo: "/edit/product/" + productId
		});
	}

	onDeleteProductRow(productId) {
		this.props.deleteProduct(productId);
	    window.location.reload(false);

	}


	render() {
		if (!this.props.product) {
			return (<div> Is Loading...</div>);
		}
		if (this.state.redirect && this.state.redirectTo) {
			return (<Redirect to={this.state.redirectTo} />);
		}
		if (!this.props.allProductsSelectors && !this.props.allUsersSelectors) {
			return (<div> Loading...</div>);
		}
		if (this.state.isSubmitting) {
			return <div style={{justifyContent: 'center'}} className="join-waitlist-loading">Joining the waitlist...</div>;
		}
		let product = this.props.product;
		let setImageURLs = product.imageURLs;
		let currImageUrls = product.imageURLs;
		if (this.state.imageURLs.length > 0) {
			currImageUrls = this.state.imageURLs;
		}
		return (
			<div className="testest" style={{}}> 	
				<div style={{padding: 32}}>
					<div>
						<div>
							<Button> Delete Product </Button>
							<Button>Save Product</Button>
						</div>
						<Form style={{maxWidth: 800}}>
							<Form.Group>
								<Form.Label> Title </Form.Label>
								<Form.Control value={this.state.title} onChange={(event) => {this.onChangeInput('title', event)}} type="text" placeholder="Enter name of product..." />
							</Form.Group>
							<Form.Group>
								<Form.Label> Description </Form.Label>
								<Form.Control value={this.state.description} onChange={(event) => {this.onChangeInput('description', event)}} type="textarea" placeholder="describe the product..." />
							</Form.Group>
							<Form.Group>
								<Form.Label> Short-handle</Form.Label>
								<Form.Control value={this.state.handle} onChange={(event) => {this.onChangeInput('handle', event)}}  type="text" placeholder="link handle..." />
							</Form.Group>
							<Form.Group>
								<Form.Label> Tags </Form.Label>
								<CreatableSelect isMulti onChange={(newValues) => {this.onMultiInputChange('tags', newValues)}} options={this.props.allProductTagsSelectors} value={this.state.tags}/>
							</Form.Group>
							<Form.Group>
								<Form.Label> Price </Form.Label>
								<Form.Control value={this.state.price} onChange={(event) => {this.onChangeInput('price', event)}} type="text" placeholder="00.00" />
							</Form.Group>
							<Form.Group>
								<Form.Label>Upload Images</Form.Label>
								<List
									values={currImageUrls}
									onChange={({oldIndex, newIndex}) => this.setImageURLs(arrayMove(currImageUrls, oldIndex, newIndex))}
									renderList={({ children, props }) => <ul {...props}>{children}</ul>}
									renderItem={({ value, props }) => <li {...props}><img src={value} style={{maxWidth: 150}}/><Button>Remove</Button></li>} />
								<Form.Label> Add Images </Form.Label>
								<Form.File onChange={(event) => {this.onChangeFileInput('imageFiles', event)}} id="productImagesFile" label="Product Images" multiple/>
							</Form.Group>
							<Form.Group>
								<Form.Label> StoreId </Form.Label>
								<Select value={this.state.storeId} onChange={(newValue) => {this.onSelectInputChange('product', 'storeId', newValue)}} options={this.props.allStoresSelectors} />
							</Form.Group>
							<Form.Group>
								<Form.Label> UserId </Form.Label>
								<Select onChange={(newValue) => {this.onSelectInputChange('product', 'userId', newValue)}} options={this.props.allUsersSelectors} />
							</Form.Group>
							<Form.Group>
								<Form.Label> Inventory Available</Form.Label>
								<Form.Control value={this.props.product.inventoryAvailableToSell} onChange={(event) => {this.onChangeInput('product', 'inventoryAvailable', event)}} type="text" placeholder="Inventory available..." />
							</Form.Group>
						</Form>
						<Button onClick={this.onSubmitUpdateProduct}>Save Product</Button>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		product: state.admin.product,
		isSubmitting: state.admin.isSubmitting,
		isLoading: state.admin.isLoading,
		createdPlant: state.admin.createdPlant,
		createdProduct: state.admin.createdProduct,
		createdStore: state.admin.createdStore,
		allUsers: state.admin.allUsers,
		allProducts: state.admin.allProducts,
		allStores: state.admin.allStores,
		allProductTags: state.admin.allProductTags,
		allUsersSelectors: state.admin.allUsersSelectors,
		allProductsSelectors: state.admin.allProductsSelectors,
		allStoresSelectors: state.admin.allStoresSelectors,
		allProductTagsSelectors: state.admin.allProductTagsSelectors
	}
}

export default connect(mapStateToProps, {deleteProduct, updateProduct, loadProductTags, loadStores, loadProduct})(AdminProductEdit);