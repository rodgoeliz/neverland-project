import React from "react";
import { Redirect, Route } from "react-router-dom";

import SellerLoadingPage from "components/layouts/seller/onboarding/SellerLoadingPage";

export default function PrivateRoute({ component: Component, authenticated, store, loading, ...rest }) {
  if (loading) {
    return (<SellerLoadingPage />);
  }
  return (
    <Route
      {...rest}
      render={(props) => {
        if (authenticated === true) {
          return <Component {...props} />
        }
          return (<Redirect to={{ pathname: '/seller/onboarding/auth', state: { from: props.location } }} />)
        }
      }
    />
  )
}

