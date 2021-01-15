import React from 'react';

import OrderResults from "components/search/components/OrderResults";

import AlgoliaSearch from 'components/search/AlgoliaSearch';

import OrderHit from 'components/search/components/OrderHit';

import SellerDashboardNavWrapper from 'components/layouts/seller/dashboard/SellerDashboardNavWrapper';

/*eslint-disable*/
export default function SellerDashboardOrdersPage({ indexName, filterQuery, searchClient }) {
  return (
      <SellerDashboardNavWrapper>
          <AlgoliaSearch 
            filterAttribute={["status"]}
            hitComponent={OrderHit} 
            indexName={indexName} 
     //       filterQuery={filterQuery} 
            ResultsComponent={OrderResults}
            searchClient={searchClient} />
      </SellerDashboardNavWrapper>
  );
}

