import React from 'react';

import { Redirect } from 'react-router-dom';

import AlgoliaSearch from 'components/search/AlgoliaSearch';

import UserHit from 'components/search/components/UserHit';

import NButton from 'components/UI/NButton';

import AdminDashboardNavWrapper from 'components/layouts/admin/dashboard/AdminDashboardNavWrapper';

import { getAlgoliaSearchClient, getAlgoliaUserIndex } from 'actions';

/*eslint-disable*/
export default function AdminDashboardStoresPage() {
    const [redirectTo, setRedirectTo] = useState(null);

    //const refreshAlgolia = (this.props.location && this.props.location.state) ? this.props.location.state.refresh : false;
    const filterQuery = ``;

    const onClickAddUser = () => {
     setRedirectTo('/admin/dashboard/user/add');
    }

    if (redirectTo) {
      return <Redirect to={redirectTo} />;
    }

    return (
        <AdminDashboardNavWrapper>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>All Users</h2>
            <NButton size='x-small' title='Add a new store' theme="secondary" onClick={onClickAddUser} />
          </div>
            <AlgoliaSearch
                filterAttributes={["tagIds.title"]}
                refreshAlgolia={refreshAlgolia}
                hitComponent={UserHit}
                indexName={getAlgoliaUserIndex()}
                searchClient={getAlgoliaSearchClient()}
                label="Products"
            />
        </AdminDashboardNavWrapper>
    );
}

