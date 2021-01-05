import React from 'react';

import AlgoliaSearch from 'components/search/AlgoliaSearch';

import ProductHit from 'components/search/components/ProductHit';

import SellerDashboardNavWrapper from 'components/layouts/seller/dashboard/SellerDashboardNavWrapper';


export default function SellerDashboardProductsPage({ indexName, searchClient }) {
        return (
            <SellerDashboardNavWrapper>
                <AlgoliaSearch hitComponent={ProductHit} indexName={indexName} searchClient={searchClient} />
            </SellerDashboardNavWrapper>
        );
    }

