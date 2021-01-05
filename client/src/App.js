import React, { Component } from 'react';
import { Route, BrowserRouter, Redirect } from "react-router-dom"
import { Provider } from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react'

import AOS from 'aos';
import { ThemeProvider } from 'styled-components';

import './App.scss';

import SellerDashboardProductsPageContainer from 'containers/seller/dashboard/SellerDashboardProductsPageContainer';
import SellerDashboardOrdersPageContainer from 'containers/seller/dashboard/SellerDashboardOrdersPageContainer';

import NeverlandHome from 'components/layouts/NeverlandHome';
import NeverlandOurStory from 'components/layouts/NeverlandOurStory';
import NeverlandWaitlist from "components/layouts/NeverlandWaitlist";
import NeverlandFAQ from "components/layouts/NeverlandFAQ";
import NeverlandContactUs from "components/layouts/NeverlandContactUs";
import Layout from 'components/layouts/Layout';
import AdminPage from "components/layouts/AdminPage";
import AdminProductEdit from "components/layouts/AdminProductEdit";
import ProductAdminView from 'components/layouts/admin/ProductAdminView';
import AddProductAdminView from 'components/layouts/admin/AddProductAdminView';
import SellerOnboardingReAuth from "components/layouts/SellerOnboardingReAuth";
import SellerOnboardingRouting from "components/layouts/SellerOnboardingRouting";
import AddProductView from 'components/layouts/seller/onboarding/AddProductView';
import PrivacyPolicy from "components/layouts/PrivacyPolicy";
import SellerOnboardingBasicsPage from "components/layouts/seller/onboarding/SellerOnboardingBasicsPage";
import SellerSignupPage from "components/layouts/seller/onboarding/SellerSignupPage";
import SellerLoginPage from "components/layouts/seller/onboarding/SellerLoginPage";
import SellerOnboardingAuthPage from "components/layouts/seller/onboarding/SellerOnboardingAuthPage";
import SellerOnboardingShopPage from "components/layouts/seller/onboarding/SellerOnboardingShopPage";
import SellerOnboardingAddProductsPage from "components/layouts/seller/onboarding/SellerOnboardingAddProductsPage";
import SellerOnboardingPaymentPage from "components/layouts/seller/onboarding/SellerOnboardingPaymentPage";
import SellerOnboardingPaymentRoutingRoomPage from "components/layouts/seller/onboarding/SellerOnboardingPaymentRoutingRoomPage";
import SellerOnboardingReAuthWebPage from "components/layouts/seller/onboarding/SellerOnboardingReAuthWebPage";
import SellerOnboardingPendingActivationPage from "components/layouts/seller/onboarding/SellerOnboardingPendingActivationPage";
import SellerOnboardingMainRoutingPage from "components/layouts/seller/onboarding/SellerOnboardingMainRoutingPage";
import SellerDashboardMainPage from "components/layouts/seller/dashboard/SellerDashboardMainPage";

import SellerDashboardShopPage from "components/layouts/seller/dashboard/SellerDashboardShopPage";
import SellerLoadingPage from "components/layouts/seller/onboarding/SellerLoadingPage";
import SellerDashboardShippingPage from "components/layouts/seller/dashboard/SellerDashboardShippingPage";
import BrandStyles from 'components/BrandStyles';

import store from './store/store';
import { auth } from './services/firebase';
import DownloadNeverland from "./download/downloadNeverland";
/* eslint-disable */
function SellerRoute({ component: Component, authenticated, store, isAdmin, loading, ...rest }) {
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

function AdminRoute({ component: Component, authenticated, store, loading, ...rest }) {
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

function PrivateRoute({ component: Component, authenticated, loading, ...rest }) {
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

function PublicRoute({ component: Component, authenticated, ...rest }) {
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      loading: true
    };
  }

  componentDidMount() {
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false
        });
      }
    })
  }

  render() {
    AOS.init();
    return (
        <Provider store={store.store}>
          <PersistGate loading={null} persistor={store.persistor}>
            <BrowserRouter>
              <ThemeProvider theme={BrandStyles}>
                <Layout className="App">
                  <div>
                    <Route exact path="/" component={NeverlandHome} />
                    <AdminRoute exact path="/admin" store={store.store} component={AdminPage} />
                    <Route exact path="/adminTwo" component={NeverlandOurStory} />
                    <AdminRoute exact path="/admin/product" store={store.store} component={ProductAdminView} />
                    <AdminRoute exact path="/admin/product/:productId" store={store.store} component={AddProductAdminView} />
                    <Route exact path="/admin/product/new" component={AddProductAdminView} />
                    <Route exact path="/story" component={NeverlandOurStory} />
                    <PublicRoute exact path="/seller/onboarding/signup" authenticated={this.state.authenticated} component={SellerSignupPage} />
                    <PublicRoute exact path="/seller/onboarding/login" authenticated={this.state.authenticated} component={SellerLoginPage} />
                    <PublicRoute exact path="/seller/onboarding/auth" authenticated={this.state.authenticated} component={SellerOnboardingAuthPage} />
                    <PublicRoute exact path="/seller/onboarding/main" authenticated={this.state.authenticated} component={SellerOnboardingMainRoutingPage} />
                    <PrivateRoute exact loading={this.state.loading} path="/seller/onboarding/basics" authenticated={this.state.authenticated} component={SellerOnboardingBasicsPage} />
                    <PrivateRoute exact loading={this.state.loading} path="/seller/onboarding/shop" authenticated={this.state.authenticated} component={SellerOnboardingShopPage} />
                    <PrivateRoute exact loading={this.state.loading} path="/seller/onboarding/products" authenticated={this.state.authenticated} component={SellerOnboardingAddProductsPage} />
                    <PrivateRoute exact loading={this.state.loading} path="/seller/onboarding/payment" authenticated={this.state.authenticated} component={SellerOnboardingPaymentPage} />
                    <PrivateRoute exact loading={this.state.loading} path="/seller/onboarding/activation-pending" authenticated={this.state.authenticated} component={SellerOnboardingPendingActivationPage} />
                    <SellerRoute exact loading={this.state.loading} store={store.store} path="/seller/dashboard/main" authenticated={this.state.authenticated} component={SellerDashboardMainPage} />
                    <SellerRoute exact loading={this.state.loading} store={store.store} path="/seller/dashboard/shop" authenticated={this.state.authenticated} component={SellerDashboardShopPage} />
                    <SellerRoute exact loading={this.state.loading} store={store.store} path="/seller/product/add" authenticated={this.state.authenticated} component={AddProductView} />
                    <SellerRoute exact loading={this.state.loading} store={store.store} path="/seller/dashboard/shipping" authenticated={this.state.authenticated} component={SellerDashboardShippingPage} />
                    <SellerRoute exact loading={this.state.loading} store={store.store} path="/seller/dashboard/orders" authenticated={this.state.authenticated} component={SellerDashboardOrdersPageContainer} />
                    <SellerRoute exact loading={this.state.loading} store={store.store} path="/seller/dashboard/products" authenticated={this.state.authenticated} component={SellerDashboardProductsPageContainer} />
                    <SellerRoute exact loading={this.state.loading} store={store.store} path="/seller/dashboard/product/:productId" authenticated={this.state.authenticated} component={AddProductView} />
                    <Route exact path="/privacy" component={PrivacyPolicy} />
                    <Route exact path="/download/neverland" component={DownloadNeverland} />
                    <Route exact path="/waitlist/user" component={NeverlandWaitlist} />
                    <Route exact path="/faq" component={NeverlandFAQ} />
                    <Route exact path="/contactus" component={NeverlandContactUs} />
                    <Route exact path="/seller/onboarding/reauth/web/:accountId" component={SellerOnboardingReAuthWebPage} />
                    <Route exact path="/seller/onboarding/return/web/:accountId" component={SellerOnboardingPaymentRoutingRoomPage} />
                    <Route exact path="/seller-onboarding/reauth/:accountId" component={SellerOnboardingReAuth} />
                    <Route exact path="/seller-onboarding/return/:accountId" component={SellerOnboardingRouting} />
                    <Route path="/edit/product/:productId" component={AdminProductEdit} />
                  </div>
                </Layout>
              </ThemeProvider>
            </BrowserRouter>
          </PersistGate>
        </Provider>
    );
  }
}

export default App;
