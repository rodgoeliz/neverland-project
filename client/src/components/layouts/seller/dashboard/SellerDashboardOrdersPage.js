import React from 'react';
import Pagination from '@material-ui/lab/Pagination';

import { TextField } from '@material-ui/core';

import AlgoliaSearch from 'components/search/AlgoliaSearch';

import OrderHit from 'components/search/components/OrderHit';

import { OrderDescription, LabelContainer, Image, NavigationArrow, RowContainer, Price, Status } from 'components/UI/Row'

import SellerDashboardNavWrapper from 'components/layouts/seller/dashboard/SellerDashboardNavWrapper';

import NButton from 'components/UI/NButton';


export default function SellerDashboardOrdersPage({ currentPage, sellerOrders, indexName, searchClient, changePage }) {
        return (
            <SellerDashboardNavWrapper>
                <TextField variant="outlined" label="Search" />
                <NButton title="Search" />
                <AlgoliaSearch hitComponent={OrderHit} indexName={indexName}  searchClient={searchClient} />
                { sellerOrders ?
                    sellerOrders.slice(
                        // Page switching with the stat store.
                        // Current page could be stored in page url
                        // Additionaly we can switch count of elements dynamically
                        currentPage, currentPage + 5
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
                    )) : <TextField> Nothing exists </TextField>
                }
                <Pagination count={10} size="large" onChange={changePage} />
            </SellerDashboardNavWrapper>
        );
    }

