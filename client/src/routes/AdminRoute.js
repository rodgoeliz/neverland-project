import React from "react";
import { connect } from "react-redux";

import { Redirect, Route } from "react-router-dom";

import SellerLoadingPage from "components/layouts/seller/onboarding/SellerLoadingPage";

function AdminRoute({ component: Component, authenticated, store, loading, ...rest }) {
  if (loading) {
    return (<SellerLoadingPage />);
  }
  let isAdmin = false;
  const state = store.getState();
  console.log("ADMINROUTE....", authenticated, state.auth)
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

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, null, null, {pure: false})(AdminRoute);

