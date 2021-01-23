import React from 'react';

import OrderResults from "components/search/components/OrderResults";

import AlgoliaSearch from 'components/search/AlgoliaSearch';

import OrderHit from 'components/search/components/OrderHit';

import AdminDashboardNavWrapper from 'components/layouts/admin/dashboard/AdminDashboardNavWrapper';

/*eslint-disable*/
export default function AdminDashboardOrdersPage({ indexName, filterQuery, searchClient }) {
  return (
      <AdminDashboardNavWrapper>
          <AlgoliaSearch 
            filterAttribute={["status"]}
            hitComponent={OrderHit} 
            indexName={indexName} 
            filterQuery={filterQuery} 
            ResultsComponent={OrderResults}
            searchClient={searchClient} />
      </AdminDashboardNavWrapper>
  );
}

