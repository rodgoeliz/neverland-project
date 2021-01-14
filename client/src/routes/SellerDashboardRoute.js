import React from 'react';
import { Redirect, Route } from "react-router-dom";

import SellerDashboardLoadingPage from "components/layouts/seller/dashboard/SellerDashboardLoadingPage";

/*eslint-disable*/
export default function SellerDashboardRoute({ component: Component, authenticated, store, isAdmin, loading, ...rest }) {
  if (loading) {
    return (<SellerDashboardLoadingPage />);
  }
  let isSeller = false;
  const state = store.getState();
  if (state) {
    isSeller = state.auth ? state.auth.isSeller : false;
  }
  return (
    <Route
      {...rest}
      render={(props) => {
        if (authenticated === true && isSeller) {
          return <Component {...props} />
        }
        return (<Redirect to={{ pathname: '/seller/onboarding/auth', state: { from: props.location } }} />)

      }
      }
    />
  )
}
