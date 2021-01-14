import React from 'react';

import AlgoliaSearch from 'components/search/AlgoliaSearch';

import ProductHit from 'components/search/components/ProductHit';

import SellerDashboardNavWrapper from 'components/layouts/seller/dashboard/SellerDashboardNavWrapper';


export default function SellerDashboardProductsPage({ indexName, searchClient }) {
    return (
        <SellerDashboardNavWrapper>
            <h2>My Products</h2>
            <AlgoliaSearch
                filterAttributes={["tagIds.title"]}
                hitComponent={ProductHit}
                indexName={indexName}
                searchClient={searchClient}
                label="Products"
            />
        </SellerDashboardNavWrapper>
    );
}

