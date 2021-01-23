import React from 'react';

import OrderResults from "components/search/components/OrderResults";

import AlgoliaSearch from 'components/search/AlgoliaSearch';

import OrderHit from 'components/search/components/OrderHit';

import AdminDashboardNavWrapper from 'components/layouts/admin/dashboard/AdminDashboardNavWrapper';
import { getAlgoliaSearchClient, getAlgoliaSellerOrderIndex } from 'actions';

/*eslint-disable*/
export default function AdminDashboardOrdersPage({ indexName, filterQuery, searchClient }) {
  return (
      <AdminDashboardNavWrapper>
          <AlgoliaSearch 
            filterAttribute={["status"]}
            hitComponent={OrderHit} 
            indexName={getAlgoliaSellerOrderIndex()} 
            filterQuery={filterQuery} 
            ResultsComponent={OrderResults}
            searchClient={getAlgoliaSearchClient()} />
      </AdminDashboardNavWrapper>
  );
}

