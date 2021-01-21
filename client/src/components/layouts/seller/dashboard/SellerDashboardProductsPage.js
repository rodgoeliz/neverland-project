import React from 'react';

import AlgoliaSearch from 'components/search/AlgoliaSearch';

import ProductHit from 'components/search/components/ProductHit';

import NButton from 'components/UI/NButton';

import SellerDashboardNavWrapper from 'components/layouts/seller/dashboard/SellerDashboardNavWrapper';


export default function SellerDashboardProductsPage({ indexName, filterQuery, refreshAlgolia, searchClient, onClickAddProduct }) {
    return (
        <SellerDashboardNavWrapper>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>My Products</h2>
            <NButton size='x-small' title='Add a new product' theme="secondary" onClick={onClickAddProduct} />
          </div>
            <AlgoliaSearch
                filterAttributes={["tagIds.title"]}
                refreshAlgolia={refreshAlgolia}
                filterQuery={filterQuery}
                hitComponent={ProductHit}
                indexName={indexName}
                searchClient={searchClient}
                label="Products"
            />
        </SellerDashboardNavWrapper>
    );
}

