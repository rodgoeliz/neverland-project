import React, { useState } from 'react';

import { Redirect } from 'react-router-dom';

import AlgoliaSearch from 'components/search/AlgoliaSearch';

import ProductHit from 'components/search/components/ProductHit';

import NButton from 'components/UI/NButton';

import AdminDashboardNavWrapper from 'components/layouts/admin/dashboard/AdminDashboardNavWrapper';

import { getAlgoliaSearchClient, getAlgoliaSellerProductIndex } from 'actions';

/*eslint-disable*/
export default function AdminDashboardProductsPage({ }) {
    const [redirectTo, setRedirectTo] = useState(null);

    //const refreshAlgolia = (this.props.location && this.props.location.state) ? this.props.location.state.refresh : false;
    const filterQuery = ``;

    const onClickAddProduct = () => {
     setRedirectTo('/admin/dashboard/products/add');
    }

    if (redirectTo) {
      return <Redirect to={redirectTo} />;
    }

    return (
        <AdminDashboardNavWrapper>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>My Products</h2>
            <NButton size='x-small' title='Add a new product' theme="secondary" onClick={onClickAddProduct} />
          </div>
            <AlgoliaSearch
                filterAttributes={["tagIds.title"]}
                refreshAlgolia={true}
                hitComponent={ProductHit}
                indexName={getAlgoliaSellerProductIndex()}
                searchClient={getAlgoliaSearchClient()}
                label="Products"
            />
        </AdminDashboardNavWrapper>
    );
}

