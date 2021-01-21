import React, { Component } from 'react';
import { Route, BrowserRouter, Switch } from "react-router-dom"
import { Provider } from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react'

import AOS from 'aos';
import { ThemeProvider } from 'styled-components';

import './App.scss';


import { SellerDashboardPaymentsPageContainer, SellerDashboardAddOrEditProductPageContainer} from "containers/seller/dashboard/";

import SellerDashboardProductsPageContainer from 'containers/seller/dashboard/SellerDashboardProductsPageContainer';
import SellerDashboardOrdersPageContainer from 'containers/seller/dashboard/SellerDashboardOrdersPageContainer';
import SellerDashboardShippingPage from "components/layouts/seller/dashboard/SellerDashboardShippingPage";
import SellerDashboardSingleOrderPage from 'components/layouts/seller/dashboard/SellerDashboardSingleOrderPage';

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
import AddProductView from 'components/product/AddProductView';
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
import SellerOnboardingShippingProfilePage from "components/layouts/seller/onboarding/SellerOnboardingShippingProfilePage";
import SellerDashboardMainPage from "components/layouts/seller/dashboard/SellerDashboardMainPage";
import SellerDashboardShopPage from "components/layouts/seller/dashboard/SellerDashboardShopPage";
import SellerLogoutPage from "components/layouts/seller/auth/SellerLogoutPage";

import BrandStyles from "components/BrandStyles";

import { AdminRoute, SellerDashboardRoute, SellerRoute, PublicRoute, PrivateRoute } from "./routes";

import store from './store/store';
import { auth } from './services/firebase';
import DownloadNeverland from "./download/downloadNeverland";

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
                <Switch>
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
                  <PrivateRoute exact loading={this.state.loading} path="/seller/onboarding/shipping" authenticated={this.state.authenticated} component={SellerOnboardingShippingProfilePage} />
                  <SellerDashboardRoute exact loading={this.state.loading} store={store.store} path="/seller/dashboard/main" authenticated={this.state.authenticated} component={SellerDashboardMainPage} />
                  <SellerDashboardRoute exact loading={this.state.loading} store={store.store} path="/seller/dashboard/shop" authenticated={this.state.authenticated} component={SellerDashboardShopPage} />
                  <SellerRoute exact loading={this.state.loading} store={store.store} path="/seller/product/add" authenticated={this.state.authenticated} component={AddProductView} />
                  <SellerDashboardRoute exact loading={this.state.loading} store={store.store} path="/seller/dashboard/shipping" authenticated={this.state.authenticated} component={SellerDashboardShippingPage} />
                  <SellerDashboardRoute exact loading={this.state.loading} store={store.store} path="/seller/dashboard/orders" authenticated={this.state.authenticated} component={SellerDashboardOrdersPageContainer} />
                  <SellerDashboardRoute exact loading={this.state.loading} store={store.store} path="/seller/dashboard/orders/:orderId" authenticated={this.state.authenticated} component={SellerDashboardSingleOrderPage} />
                  <SellerDashboardRoute exact loading={this.state.loading} store={store.store} path="/seller/dashboard/products" authenticated={this.state.authenticated} component={SellerDashboardProductsPageContainer} />
                  <SellerDashboardRoute exact loading={this.state.loading} store={store.store} path="/seller/dashboard/products/add" authenticated={this.state.authenticated} component={SellerDashboardAddOrEditProductPageContainer} />
                  <SellerDashboardRoute exact loading={this.state.loading} store={store.store} path="/seller/dashboard/product/:productId" authenticated={this.state.authenticated} component={SellerDashboardAddOrEditProductPageContainer} />
                  <SellerDashboardRoute exact loading={this.state.loading} store={store.store} path="/seller/dashboard/payments" authenticated={this.state.authenticated} component={SellerDashboardPaymentsPageContainer} />
                  <PublicRoute exact loading={this.state.loading} store={store.store} path="/seller/logout" authenticated={this.state.authenticated} component={SellerLogoutPage} />
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
                </Switch>
              </Layout>
            </ThemeProvider>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
