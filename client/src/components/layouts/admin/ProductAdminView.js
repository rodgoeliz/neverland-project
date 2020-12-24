import React, { Component, forwardRef } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import MaterialTable from 'material-table';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import BrandStyles from 'components/BrandStyles';

import { getProductList } from 'actions/products';

import NButton from "components/UI/NButton";

import AddProductAdminView from './AddProductAdminView';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

class ProductAdminView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAddProductModalVisible: false
    }

    this.onChange = this.onChange.bind(this);
    this.onPressAddProduct = this.onPressAddProduct.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this.onPressAddProductCSV = this.onPressAddProductCSV.bind(this);
    this._closeCSVModal = this._closeCSVModal.bind(this);
    this._loadProducts = this._loadProducts.bind(this);
  }

  async _loadProducts() {
    await this.props.getProductList();
    this.setState({
      isLoading: false
    });
  }

  componentDidMount() {
    if (!this.props.productsCacheArr || !this.props.productsCache || Object.keys(this.props.productsCache) === 0 || Object.keys(this.props.productsCacheArr) === 0) {
      this.setState({
        isLoading: true
      }, () => {
        this._loadProducts();
      });
    }
  }

  _closeModal() {
    this.setState({
      isAddProductModalVisible: false
    });
  }

  _closeCSVModal() {}

  onChange(formData) {
    console.log("Product form data change", formData);
  }

  onPressAddProduct() {
    this.setState({
      isAddProductModalVisible: true,
    });
  }

  onPressAddProductCSV() {}

  render() {
    if (this.state.isLoading) {
      return (<div> loading...</div>);
    }

    const columns = [
      {
        title: 'ID',
        field: '_id',
      },
      {
        title: 'Title',
        field: 'title'
      },
      {
        title: 'Price',
        field: 'price',
        render: rowData => {
          console.log('rowData', rowData)
          if (rowData.price && rowData.price.value) {
            return (<div>${parseFloat(rowData.price.value) / 100}</div>);
          }
          return (<div>No Price Data Available</div>)
        }
      },
      {
        title: 'Store Name',
        field: 'vendorId',
        render: rowData => {
          if (rowData.storeId) {
            const storeTitle = rowData.storeId.title;
            let vendorName = "";
            if (rowData.vendorId && rowData.vendorId.email) {
              vendorName = rowData.vendorId.email;
            }
            return (<div>{storeTitle} ({vendorName || 'No Owner'})</div>);
          }
          return "No Store";
        }
      }
    ];
    console.log('this.props', this.props)
    if (this.state.openEditProductModalId) {
      // return (<Redirect to={`/admin/product/${this.state.openEditProductModalId}`} />);
    }
    return (
      <div>
        <Modal
          style={{ content: { borderRadius: 32, backgroundColor: BrandStyles.color.lightBeige } }}
          isOpen={this.state.isAddProductModalVisible}>
          <AddProductAdminView onChange={this.onChange} onClose={this._closeModal} />
        </Modal>
        <NButton title="Add a product" onClick={this.onPressAddProduct} />
        <NButton title="Import CSV" onClick={this.onPressAddProductCSV} />
        <div>
          <MaterialTable
            title="Products"
            columns={columns}
            icons={tableIcons}
            onRowClick={(event, rowData) => {
              this.setState({
                openEditProductModalId: rowData._id
              });
            }}
            options={{
              filtering: true,
              search: true
            }}
            data={this.props.productsCacheArr} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  productsCache: state.products.productsCache,
  productsCacheArr: state.products.productsCacheArr,
  currentProduct: state.seller.currentProduct
});

const actions = {
  getProductList
};
export default connect(mapStateToProps, actions)(ProductAdminView);