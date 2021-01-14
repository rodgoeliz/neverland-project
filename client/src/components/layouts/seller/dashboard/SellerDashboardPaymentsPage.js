import React, { useState } from 'react';
import {Tabs, Tab} from '@material-ui/core';
import styled from 'styled-components';

import OrderResults from "components/search/components/OrderResults";

import AlgoliaSearch from 'components/search/AlgoliaSearch';

import OrderHit from 'components/search/components/OrderHit';

import SellerDashboardNavWrapper from 'components/layouts/seller/dashboard/SellerDashboardNavWrapper';

const NTabs = styled(Tabs)`
`;

const NTab = styled(Tab)`
`;

export default function SellerDashboardPaymentPage({ indexName, searchClient }) {
  console.log(searchClient)
    const [tabIndex, setTabIndex] = useState(0);
    const handleChange = (event, index) => {
      console.log("handleChange: ", index)
      setTabIndex(index);
    }
    let tabContent = <div>None</div>;
    const now = new Date().getTime(); 
    console.log("NOW: ", now)
    const thirtyDays = now - 1000*60*60*24*30;
    console.log("THIRTY DAYS:", thirtyDays)
    console.log(`status:paid-out" AND "paidOutAt < ${now}" AND "paidOut > ${thirtyDays}`);
    if (tabIndex === 0) {
      tabContent = <AlgoliaSearch 
            hitComponent={OrderHit} 
            filterQuery={`status:paid-out AND paidOutAt:${thirtyDays} TO ${now}`}
            indexName={indexName} 
            ResultsComponent={OrderResults}
            searchClient={searchClient} />
    } else if (tabIndex === 1) {

      tabContent = <AlgoliaSearch 
            hitComponent={OrderHit} 
            filterQuery="status:need-to-fulfill"
            indexName={indexName} 
            ResultsComponent={OrderResults}
            searchClient={searchClient} />
    }
    return (
        <SellerDashboardNavWrapper>
            <h2>My Payments & Payouts</h2>
            <div> Payment info here -> click to edit</div>
            <NTabs value={tabIndex} onChange={handleChange}>
              <NTab label="Paid out"/>
              <NTab label="Pending"/>
            </NTabs>
            {tabContent}
        </SellerDashboardNavWrapper>
    );
}

