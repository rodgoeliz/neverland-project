import React, { useState } from 'react';

import { Redirect } from 'react-router-dom';

import AlgoliaSearch from 'components/search/AlgoliaSearch';

import StoreHit from 'components/search/components/StoreHit';

import NButton from 'components/UI/NButton';

import AdminDashboardNavWrapper from 'components/layouts/admin/dashboard/AdminDashboardNavWrapper';

import { getAlgoliaSearchClient, getAlgoliaSellerStoreIndex } from 'actions';

/*eslint-disable*/
export default function AdminDashboardStoresPage() {
    const [redirectTo, setRedirectTo] = useState(null);

    //const refreshAlgolia = (this.props.location && this.props.location.state) ? this.props.location.state.refresh : false;
    const filterQuery = ``;

    const onClickAddStore = () => {
     setRedirectTo('/admin/dashboard/stores/add');
    }

    if (redirectTo) {
      return <Redirect to={redirectTo} />;
    }

    return (
        <AdminDashboardNavWrapper>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>My Products</h2>
            <NButton size='x-small' title='Add a new store' theme="secondary" onClick={onClickAddStore} />
          </div>
            <AlgoliaSearch
                filterAttributes={["tagIds.title"]}
                refreshAlgolia={refreshAlgolia}
                hitComponent={StoreHit}
                indexName={getAlgoliaSellerStoreIndex()}
                searchClient={getAlgoliaSearchClient()}
                label="Products"
            />
        </AdminDashboardNavWrapper>
    );
}

