import React, { useState } from 'react';
import {Tabs, Tab} from '@material-ui/core';
import styled from 'styled-components';

import OrderResults from "components/search/components/OrderResults";

import AlgoliaSearch from 'components/search/AlgoliaSearch';

import OrderHit from 'components/search/components/OrderHit';

import SellerDashboardNavWrapper from 'components/layouts/seller/dashboard/SellerDashboardNavWrapper';

import BrandStyles from 'components/BrandStyles';

const NTabs = styled(Tabs)`
  padding-top: 1em;
  padding-bottom: 2em;
`;

const NTab = styled(Tab)`
  && { 
    border-bottom: 4px solid ${BrandStyles.color.blue};
    color: ${BrandStyles.color.black}
  }
`;

const PayoutsContainer = styled.div`
  padding-top: 2em;
  padding-bottom: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PayoutsListContainer = styled.div`
  background-color: ${BrandStyles.color.lightBeige}
`;

export default function SellerDashboardPaymentPage({ indexName, searchClient, sellerId }) {
    const [tabIndex, setTabIndex] = useState(0);
    const handleChange = (event, index) => {
      setTabIndex(index);
    }
    let tabContent = <div>None</div>;
    const now = new Date().getTime(); 
    const thirtyDays = now - 1000*60*60*24*30;
    const paidOutQuery =  `storeId.userId:${sellerId} AND status:paid-out AND paidOutAt: ${now} TO ${thirtyDays}`;
    const pendingQuery = `storeId.userId:${sellerId} AND status:need-to-fulfill`;
    if (tabIndex === 0) {
      tabContent = 
      <PayoutsListContainer>
        <h3> Paid out orders </h3>
        <AlgoliaSearch 
            hitComponent={OrderHit} 
            filterQuery={paidOutQuery}
            indexName={indexName} 
            label="paid out orders"
            ResultsComponent={OrderResults}
            searchClient={searchClient} />
      </PayoutsListContainer>
    } else if (tabIndex === 1) {

      tabContent = 
      <PayoutsListContainer>
        <h3> Pending payout orders </h3>
          <AlgoliaSearch 
            hitComponent={OrderHit} 
            filterQuery={pendingQuery}
            label="pending orders"
            indexName={indexName} 
            ResultsComponent={OrderResults}
            searchClient={searchClient} />
      </PayoutsListContainer>
    }
    return (
        <SellerDashboardNavWrapper>
            <h2>My Payments & Payouts</h2>
            <PayoutsContainer>
              <NTabs 
                textColor={BrandStyles.color.black}
                indicatorColor={BrandStyles.color.blue} 
                value={tabIndex} 
                onChange={handleChange}>
                <NTab label="Paid out"/>
                <NTab label="Pending"/>
              </NTabs>
              {tabContent}
            </PayoutsContainer>
        </SellerDashboardNavWrapper>
    );
}

