import React from "react";
import {Redirect, Route} from "react-router-dom";

import SellerLoadingPage from "components/layouts/seller/onboarding/SellerLoadingPage";


export default function SellerRoute({ component: Component, exact, authenticated, path, store, isAdmin, loading, ...rest }) {
  if (loading) {
    return (<SellerLoadingPage />);
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
