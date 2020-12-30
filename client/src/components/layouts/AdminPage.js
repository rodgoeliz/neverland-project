import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Redirect} from "react-router-dom";
import {Accordion, Button, Form, Modal} from 'react-bootstrap';

import Select from 'react-select';

import CreatableSelect from 'react-select/creatable';
import DataTable from 'react-data-table-component';

import { createPlant, createProduct, createStore, deleteProduct, handleClickCreateNavigation, loadProductTags, uploadStoreFiles, uploadProductFiles, createProductTags, loadUsers, loadProducts, loadStores} from "actions/admin";

import AccordionCard from "components/AccordionCard";


class AdminPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			productUserInputValue: "",
			showProductFileModal: false
		}
		this.onClickWaitlist = this.onClickWaitlist.bind(this);
		this.onChangeInput= this.onChangeInput.bind(this);
		this.onSubmitCreateProduct = this.onSubmitCreateProduct.bind(this);
		this.onSubmitCreateStore = this.onSubmitCreateStore.bind(this);
		this.onSubmitCreateTags = this.onSubmitCreateTags.bind(this);

	}

	async componentDidMount() {
		if (this.props) {
			this.props.loadProducts();
			this.props.loadUsers();
			this.props.loadStores();
			this.props.loadProductTags();
		}
	}

	loadAllusers = (inputValue, callback) => {
		setTimeout(() => {
			callback(this.props.allUsers);
		})
	}

	onClickWaitlist() {
		// validate email
		if (this.validateEmail(this.state.emailInput)) {
			this.props.joinWaitlist(this.state.emailInput, this.state.inviter);
			this.setState({
				"emailError": "",
				isSubmitting: true
			});
		} else {
			this.setState({"emailError": "Please enter valid email"})
		}
		// window.location = "https://docs.google.com/forms/d/e/1FAIpQLSeZcRVCsn-_cOXdcMyjEfR7PQ9N536zi0NGdVZRbcfE4KUCpg/viewform"
	}

	onPressImportProductCSV = async () => {
		this.setState({
			showProductFileModal: true,
		});
	}

	onPressShowStoreImportFileModal = async () => {
		this.setState({
			showStoreFileModal: true
		})
	}

	onHideStoreImportFileModal = () => {
		this.setState({
			showStoreFileModal: false
		})
	}
	
	onHideProductFileModal= () => {
		this.setState({
			showProductFileModal: false
		})
	}

	onImportStoreJSONFiles = async () => {
		const {store} = this.state;
		const formData = new FormData();
		console.log(store.storeJSONFiles)
		for (let i = 0; i < store.storeJSONFiles.length; i++) {
			formData.append(`storeFile[${i}]`, store.storeJSONFiles[i]);
		}
		formData.append('fileType', "json");
		await this.props.uploadStoreFiles(formData);
		
	}

	onImportStoreCSVFiles = async () => {
		const {store} = this.state;
		const formData = new FormData();
		console.log(store.storeCSVFiles)
		for (let i = 0; i < store.storeCSVFiles.length; i++) {
			formData.append(`storeFile[${i}]`, store.productCSVFiles[i]);
		}
		formData.append('fileType', "csv");
		await this.props.uploadStoreFiles(formData);
		
	}

	onImportProductJSONFiles = async () => {
		const {product} = this.state;
		const formData = new FormData();
		console.log(product.productJSONFiles)
		for (let i = 0; i < product.productJSONFiles.length; i++) {
			formData.append(`productFile[${i}]`, product.productJSONFiles[i]);
		}
		formData.append('fileType', "json");
		await this.props.uploadProductFiles(formData);
		
	}

	onImportProductCSVFiles = async () => {
		const {product} = this.state;
		const formData = new FormData();
		console.log(product.productCSVFiles)
		for (let i = 0; i < product.productCSVFiles.length; i++) {
			formData.append(`productFile[${i}]`, product.productCSVFiles[i]);
		}
		formData.append('fileType', "csv");
		await this.props.uploadProductFiles(formData);
		
	}

	async onSubmitCreateProduct() {
		const {product} = this.state;
		const formData = new FormData();
		for (let i = 0; i < product.imageFiles.length; i++) {
			formData.append(`imageFile[${i}]`, product.imageFiles[i]);
		}

		formData.append('title', product.title);
		formData.append('description', product.description);
		formData.append('handle', product.handle);
		formData.append('inventoryAvailable', product.inventoryAvailable);
		formData.append('storeId', product.storeId);
		formData.append('price', product.price);
		formData.append('tagIds', product.tags)
		await this.props.createProduct(formData);
		
	}

	async onSubmitCreateStore() {
		const {store} = this.state;
		const productInput = {
			userId: store.userId,
			productIds: store.products
		};
		await this.props.createStore(productInput);
	}

	async onSubmitCreateTags() {
		const {tags} = this.state;
		await this.props.createProductTags({tags});
	}

	onSelectInputChange(sectionId, subSectionId, value) {
		let section = this.state[sectionId];
		if (!section) {
			section = {}
		}
		section[subSectionId] = value.value;
		this.setState({
			[sectionId]: section
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

		const allValues = values.map((value) => value.value);
		this.setState({
			[sectionId]: allValues
		})
	}

	onMultiInputChange(sectionId, subSectionId, values) {
		let section = this.state[sectionId];
		if (!section) {
			section = {}
		}
		const allValues = values.map((value) => value.value);
		section[subSectionId] = allValues;
		this.setState({
			[sectionId]: section
		})
	}

	onChangeFileInput(sectionId, productId, event) {
		let section = this.state[sectionId];
		if (!section) {
			section = {}
		}
		section[productId] = event.target.files;
		this.setState({
			[sectionId]: section
		});
	}

	onChangeInput(sectionId, productId, event) {
		let section = this.state[sectionId];
		if (!section) {
			section = {}
		}
		section[productId] = event.target.value;
		this.setState({
			[sectionId]: section
		});
	}

	onEditProductRow(productId) {
		this.setState({
			redirect: true,
			redirectTo: `/edit/product/${  productId}`
		});
	}

	onDeleteProductRow(productId) {
		this.props.deleteProduct(productId);
	    window.location.reload(false);

	}

	renderProductsDataTable() {
		const columns =[
			{
				name: 'Title',
				selector: 'title',
				sortable: true
			},
			{
				name: 'Tags',
				selector: 'tags'
			},
			{
				name: 'store Id',
				selector: 'storeId'
			},
			{
				name: 'Owner (user)',
				selector: 'userId'

			},
			{
				name: 'Price',
				selector: 'price'
			},
			{
				name: 'Manage',
				button: true,
				cell: row => <div><Button onClick={() => this.onEditProductRow(row._id)}> Edit</Button> <Button onClick={() => this.onDeleteProductRow(row._id)}>Delete</Button></div>
			}
		];
		return (
			<DataTable
				title="Products"
				columns={columns}
				data={this.props.allProducts}	
				pagination
				striped
				pointerOnHover />
			)
	}

	handleClickCreateNavigation() {
		console.log("handlePressCreateNavigation")
		this.props.handleClickCreateNavigation();
	}

	render() {
		if (this.state.redirect && this.state.redirectTo) {
			return (<Redirect to={this.state.redirectTo} />);
		}
		if (!this.props.allProductsSelectors && !this.props.allUsersSelectors) {
			return (<div> Loading...</div>);
		}
		if (this.state.isSubmitting) {
			return <div style={{justifyContent: 'center'}} className="join-waitlist-loading">Joining the waitlist...</div>;
		}
		let createProductMessage = "";
		if (this.props.createdProduct) {
			createProductMessage =  "Product Created"
		}
		let createStoreMessage = "";
		if (this.props.createdStore) {
			createStoreMessage =  "Store Created"
		}
		let createProductTagsMessage = "";
		if (this.props.createdTags) {
			createProductTagsMessage =  "Store Created"
		}

		return (
			<div className="testest" style={{}}> 	
				<div>
					{this.renderProductsDataTable()}
					<Accordion>
						<AccordionCard eventKey="0" title="Navigation">
							<Button title="Create Navigation" onClick={() => {this.handleClickCreateNavigation()}}>Set Navigation</Button>
						</AccordionCard>
						<AccordionCard eventKey="0" title="Add Product">
							<div><Button onClick={(event) => {this.onPressImportProductCSV(event)}}>Import CVS</Button></div>
							<Modal show={this.state.showProductFileModal} onHide={this.onHideProductFileModal}>
								<Modal.Body>
									<Form>
										<Form.Group>
											<Form.Label>Upload Product CSV Files</Form.Label>
											<Form.File onChange={(event) => {this.onChangeFileInput('product', 'productCSVFiles', event)}} id="productCSVFiles" label="Product CSV Files" multiple/>
										</Form.Group>
										<Button onClick={() => {this.onImportProductCSVFiles()}} > Submit </Button>
										<Form.Group>
											<Form.Label>Upload Product JSON Files</Form.Label>
											<Form.File onChange={(event) => {this.onChangeFileInput('product', 'productJSONFiles', event)}} id="productCSVFiles" label="Product CSV Files" multiple/>
										</Form.Group>
										<Button onClick={() => {this.onImportProductJSONFiles()}} > Submit </Button>
									</Form>
								</Modal.Body>
							</Modal>
							<div>
								<Form>
									<Form.Group>
										<Form.Label> Title </Form.Label>
										<Form.Control onChange={(event) => {this.onChangeInput('product', 'title', event)}} type="text" placeholder="Enter name of product..." />
									</Form.Group>
									<Form.Group>
										<Form.Label> Description </Form.Label>
										<Form.Control onChange={(event) => {this.onChangeInput('product', 'description', event)}} type="textarea" placeholder="describe the product..." />
									</Form.Group>
									<Form.Group>
										<Form.Label> Short-handle</Form.Label>
										<Form.Control onChange={(event) => {this.onChangeInput('product', 'handle', event)}}  type="text" placeholder="link handle..." />
									</Form.Group>
									<Form.Group>
										<Form.Label> Tags </Form.Label>
										<CreatableSelect isMulti onChange={(newValues) => {this.onMultiInputChange('product', 'tags', newValues)}} options={this.props.allProductTagsSelectors} />
									</Form.Group>
									<Form.Group>
										<Form.Label> Price </Form.Label>
										<Form.Control onChange={(event) => {this.onChangeInput('product', 'price', event)}} type="text" placeholder="00.00" />
									</Form.Group>
									<Form.Group>
										<Form.Label>Upload Images</Form.Label>
										<Form.File onChange={(event) => {this.onChangeFileInput('product', 'imageFiles', event)}} id="productImagesFile" label="Product Images" multiple/>
									</Form.Group>
									<Form.Group>
										<Form.Label> StoreId </Form.Label>
										<Select onChange={(newValue) => {this.onSelectInputChange('product', 'storeId', newValue)}} options={this.props.allStoresSelectors} />
									</Form.Group>
									<Form.Group>
										<Form.Label> UserId </Form.Label>
										<Select onChange={(newValue) => {this.onSelectInputChange('product', 'userId', newValue)}} options={this.props.allUsersSelectors} />
									</Form.Group>
									<Form.Group>
										<Form.Label> Inventory Available</Form.Label>
										<Form.Control onChange={(event) => {this.onChangeInput('product', 'inventoryAvailable', event)}} type="text" placeholder="Inventory available..." />
									</Form.Group>
								</Form>
								<Button onClick={this.onSubmitCreateProduct}>Create Product</Button>
								<div> {createProductMessage}</div>
							</div>
						</AccordionCard>
						<AccordionCard eventKey="1" title="Add User">
							<div>
								Name
							</div>
						</AccordionCard>
						<AccordionCard eventKey="2" title="Add Plant">
							<div>
								Name
								title
								description
								hardinessZoneMin
								hardinessZoneMax
								lightMin
								lightMax
								wateringcycletype
								wateringcyclemin
								wateringcyclemax
							</div>
						</AccordionCard>
						<AccordionCard eventKey="3" title="Add Tags">
							<div>
								<Form>
									<Form.Group>
										<Form.Label> Tags </Form.Label>
										<CreatableSelect isMulti onChange={(newValues) => {this.onTagMultiInputChange('tags', newValues)}} options={this.props.allProductTagsSelectors} />
									</Form.Group>
								</Form>
								<Button onClick={this.onSubmitCreateTags}>Create Product Tags</Button>
								<div> {createProductTagsMessage}</div>
							</div>

							<div>
								Name
								Products
							</div>
						</AccordionCard>
						<AccordionCard eventKey="3" title="Add Store">
							<div><Button onClick={(event) => {this.onPressShowStoreImportFileModal(event)}}>Import File</Button></div>
							<Modal show={this.state.showStoreFileModal} onHide={this.onHideStoreImportFileModal}>
								<Modal.Body>
									<Form>
										<Form.Group>
											<Form.Label>Upload Store CSV Files</Form.Label>
											<Form.File onChange={(event) => {this.onChangeFileInput('store', 'storeCSVFiles', event)}} id="storeCSVFiles" label="Store CSV Files" multiple/>
										</Form.Group>
										<Button onClick={() => {this.onImportStoreCSVFiles()}} > Submit </Button>
										<Form.Group>
											<Form.Label>Upload Store JSON Files</Form.Label>
											<Form.File onChange={(event) => {this.onChangeFileInput('store', 'storeJSONFiles', event)}} id="storeJSONFiles" label="Store Json Files" multiple/>
										</Form.Group>
										<Button onClick={() => {this.onImportStoreJSONFiles()}} > Submit </Button>
									</Form>
								</Modal.Body>
							</Modal>
							<div>
								<Form>
									<Form.Group>
										<Form.Label> User </Form.Label>
										<Select onChange={(newValue) => {this.onSelectInputChange('store', 'userId', newValue)}} options={this.props.allUsersSelectors} />
									</Form.Group>
									<Form.Group>
										<Form.Label> Products </Form.Label>
										<Select onChange={(event) => {this.onMultiInputChange('store', 'products', event)}} isMulti options={this.props.allProductsSelectors} />
									</Form.Group>
									<Form.Group>
										<Form.Label> Collections </Form.Label>
										<Form.Control onChange={(event) => {this.onChangeInput('store', 'collections', event)}}  type="text" placeholder="link handle..." />
									</Form.Group>
								</Form>
								<Button onClick={this.onSubmitCreateStore}>Create Store</Button>
								<div> {createStoreMessage}</div>
							</div>

							<div>
								Name
								Products
							</div>
						</AccordionCard>
					</Accordion>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
		isSubmitting: state.admin.isSubmitting,
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
	})

export default connect(mapStateToProps, {handleClickCreateNavigation, uploadStoreFiles, uploadProductFiles, deleteProduct, createPlant, loadProducts, loadUsers, loadStores, loadProductTags, createProduct, createStore, createProductTags})(AdminPage);