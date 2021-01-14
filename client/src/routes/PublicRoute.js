import React from 'react';

import { Route } from "react-router-dom";

export default function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === false
        ? <Component {...props} />
        : <Component {...props} />
      }
    />
  )
}

