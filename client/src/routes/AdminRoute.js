import React from "react";
import { Redirect, Route } from "react-router-dom";

import SellerLoadingPage from "components/layouts/seller/onboarding/SellerLoadingPage";

export default function AdminRoute({ component: Component, authenticated, store, loading, ...rest }) {
  if (loading) {
    return (<SellerLoadingPage />);
  }
  let isAdmin = false;
  const state = store.getState();
  if (state) {
    isAdmin = state.auth ? state.auth.isAdmin : false;
  }
  return (
    <Route
      {...rest}
      render={(props) => {
        if (authenticated === true && isAdmin === true) {
          return <Component {...props} />
        }
        return (<Redirect to={{ pathname: '/seller/onboarding/auth', state: { from: props.location } }} />)

      }
      }
    />
  )
}

