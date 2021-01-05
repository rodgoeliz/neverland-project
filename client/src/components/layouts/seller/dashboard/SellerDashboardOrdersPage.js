import React from 'react';

import AlgoliaSearch from 'components/search/AlgoliaSearch';

import OrderHit from 'components/search/components/OrderHit';

import SellerDashboardNavWrapper from 'components/layouts/seller/dashboard/SellerDashboardNavWrapper';


export default function SellerDashboardOrdersPage({ indexName, filterQuery, searchClient }) {
  return (
      <SellerDashboardNavWrapper>
          <AlgoliaSearch filterAttribute="status" hitComponent={OrderHit} indexName={indexName} filterQuery={filterQuery} searchClient={searchClient} />
      </SellerDashboardNavWrapper>
  );
}

