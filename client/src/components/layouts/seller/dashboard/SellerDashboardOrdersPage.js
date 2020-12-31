import React from 'react';
import { connect } from 'react-redux';
import Pagination from '@material-ui/lab/Pagination';
import { TextField } from '@material-ui/core';

import { OrderDescription, LabelContainer, Image, NavigationArrow, RowContainer, Price, Status } from 'components/UI/Row'
import SellerDashboardNavWrapper from 'components/layouts/seller/dashboard/SellerDashboardNavWrapper';
import NButton from 'components/UI/NButton';
import { getSellerProducts, changeSellerPage } from 'actions';


class SellerDashboardOrdersPage extends React.Component {
    componentDidMount() {
        // For every update just fetch data for get seller products
        this.props.getSellerProducts(this.props.auth._id);
    }

    changePage = (event, value) => {
        this.props.changeSellerPage(value - 1);
    }

    render() {
        const { currentPage } = this.props.seller
        return (
            <SellerDashboardNavWrapper>
                <TextField variant="outlined" label="Search" />
                <NButton title="Search" />
                {
                    this.props.seller.productsCache.slice(
                        // Page switching with redux store.
                        // Current page could be stored in page url
                        currentPage - 1, currentPage + 5
                    ).map(product => (
                        <RowContainer>
                            <LabelContainer labelText="11/20/2020 - Today">
                                <Image src={product.imageURLs[0]} />
                                <OrderDescription
                                    order={product._id}
                                    title={product.title}
                                    content={[product.handle]}
                                />
                                <Price>
                                    {product.price.value} {product.price.currency}
                                </Price>
                            </LabelContainer>
                            <Status>
                                NEEDS TO BE FULFILLED
                            </Status>
                            <NavigationArrow to='/home' />
                        </RowContainer>
                    ))
                }

                {/* 
                Product rows example:
                <RowContainer>
                    <Image src='https://www.interfacemedia.com/media/2350/img-vr-tilt-brush-website-hero-shot.jpg' />
                    <OrderDescription
                        order='100333'
                        title='Hayley Leibson'
                        content={['Lorem ipsum dolor sit amet, consectetur adipiscing elit.']}
                    />
                    <Price>
                        100$
                        </Price>
                    <SoldAndQuantity sold={99} quantity={50} />
                    <ToggleVisibility text='IS VISIBLE' />
                    <NavigationArrow to='/home' />
                </RowContainer>
 */}

                <Pagination count={10} size="large" onChange={this.changePage} />
            </SellerDashboardNavWrapper>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    seller: state.seller
});

export default connect(mapStateToProps, { getSellerProducts, changeSellerPage })(SellerDashboardOrdersPage);
