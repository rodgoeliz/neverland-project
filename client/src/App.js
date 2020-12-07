import React, {Component} from 'react';
import {Route, BrowserRouter, Redirect } from "react-router-dom"
import { Provider } from 'react-redux';
import { auth } from './services/firebase';
import store from './store/store';
import logo from './logo.svg';
import { PersistGate } from 'redux-persist/integration/react'
import './App.scss';
import NeverlandHome from './components/layouts/NeverlandHome';
import NeverlandOurStory from './components/layouts/NeverlandOurStory';
import NeverlandWaitlist from "./components/layouts/NeverlandWaitlist";
import NeverlandFAQ from "./components/layouts/NeverlandFAQ";
import NeverlandContactUs from "./components/layouts/NeverlandContactUs";
import Layout from './components/layouts/Layout';
import AdminPage from "./components/layouts/AdminPage";
import AdminProductEdit from "./components/layouts/AdminProductEdit";
import ProductAdminView from './components/layouts/admin/ProductAdminView';
import AddProductAdminView from './components/layouts/admin/AddProductAdminView';
import SellerOnboardingReAuth from "./components/layouts/SellerOnboardingReAuth";
import SellerOnboardingRouting from "./components/layouts/SellerOnboardingRouting";
import PrivacyPolicy from "./components/layouts/PrivacyPolicy";
import SellerOnboardingBasicsPage from "./components/layouts/seller/onboarding/SellerOnboardingBasicsPage";
import SellerSignupPage from "./components/layouts/seller/onboarding/SellerSignupPage";
import SellerLoginPage from "./components/layouts/seller/onboarding/SellerLoginPage";
import SellerOnboardingAuthPage from "./components/layouts/seller/onboarding/SellerOnboardingAuthPage";
import SellerOnboardingShopPage from "./components/layouts/seller/onboarding/SellerOnboardingShopPage";
import SellerOnboardingAddProductsPage from "./components/layouts/seller/onboarding/SellerOnboardingAddProductsPage";
import SellerOnboardingPaymentPage from "./components/layouts/seller/onboarding/SellerOnboardingPaymentPage";
import SellerOnboardingPaymentRoutingRoomPage from "./components/layouts/seller/onboarding/SellerOnboardingPaymentRoutingRoomPage";
import SellerOnboardingReAuthWebPage from "./components/layouts/seller/onboarding/SellerOnboardingReAuthWebPage";
import SellerOnboardingPendingActivationPage from "./components/layouts/seller/onboarding/SellerOnboardingPendingActivationPage";
import SellerOnboardingMainRoutingPage from "./components/layouts/seller/onboarding/SellerOnboardingMainRoutingPage";
import SellerLoadingPage from "./components/layouts/seller/onboarding/SellerLoadingPage";
import DownloadNeverland from "./download/downloadNeverland";
import {ParallaxProvider} from "react-scroll-parallax";
import AOS from 'aos';

function AdminRoute({ component: Component, authenticated, isAdmin, loading, ...rest }) {
  if (loading) {
    return (<SellerLoadingPage />);
  }
  return (
    <Route
      {...rest}
      render={(props) =>{ 
        if (authenticated == true && isAdmin == true) {
          return <Component {...props} />
        } else {
          return (<Redirect to={{ pathname: '/auth', state: { from: props.location } }} />)
        }
      }
    }
    />
  )
}

function PrivateRoute({ component: Component, authenticated, loading, ...rest }) {
  if (loading) {
    return (<SellerLoadingPage />);
  }
  console.log("PRIVATE ROUTE: ", authenticated)
  return (
    <Route
      {...rest}
      render={(props) =>{ 
        if (authenticated == true) {
          return <Component {...props} />
        } else {
          return (<Redirect to={{ pathname: '/seller/onboarding/auth', state: { from: props.location } }} />)
        }
      }
    }
    />
  )
}

function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        console.log("Public Route", props)
       return  authenticated === false
        ? <Component {...props} />
        : <Component {...props} />}
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
    <ParallaxProvider>
        <Provider store={store.store}>
          <PersistGate loading={null} persistor={store.persistor}>
          <BrowserRouter>
            <Layout className="App">
              <div>
                <Route exact path="/" component={NeverlandHome} />
                <Route exact path="/admin" component={AdminPage} />
                <Route exact path="/adminTwo" component={NeverlandOurStory} />
                <Route exact path ="/admin/product" component={ProductAdminView} />
                <Route exact path ="/admin/product/:productId" component={AddProductAdminView} />
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
          </BrowserRouter>
          </PersistGate>
        </Provider>
      </ParallaxProvider>
        );
  }
}

export default App;
