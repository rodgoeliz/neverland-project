import React, {Component} from 'react';
import {Route, BrowserRouter} from "react-router-dom"
import { Provider } from 'react-redux';
import store from './store/store';
import logo from './logo.svg';
import './App.scss';
import NeverlandHome from './components/layouts/NeverlandHome';
import NeverlandOurStory from './components/layouts/NeverlandOurStory';
import NeverlandWaitlist from "./components/layouts/NeverlandWaitlist";
import NeverlandFAQ from "./components/layouts/NeverlandFAQ";
import NeverlandContactUs from "./components/layouts/NeverlandContactUs";
import Layout from './components/layouts/Layout';
import AdminPage from "./components/layouts/AdminPage";
import AdminProductEdit from "./components/layouts/AdminProductEdit";
import SellerOnboardingReAuth from "./components/layouts/SellerOnboardingReAuth";
import SellerOnboardingRouting from "./components/layouts/SellerOnboardingRouting";
import PrivacyPolicy from "./components/layouts/PrivacyPolicy";
import DownloadNeverland from "./download/downloadNeverland";
import {ParallaxProvider} from "react-scroll-parallax";
import AOS from 'aos';

class App extends Component {
  render() {
    AOS.init();
    return (
    <ParallaxProvider>
        <Provider store={store}>
          <BrowserRouter>
            <Layout className="App">
              <div>
                <Route exact path="/" component={NeverlandHome} />
                <Route exact path="/admin" component={AdminPage} />
                <Route exact path="/adminTwo" component={NeverlandOurStory} />
                <Route exact path="/story" component={NeverlandOurStory} />
                <Route exact path="/privacy" component={PrivacyPolicy} />
                <Route exact path="/download/neverland" component={DownloadNeverland} />
                <Route exact path="/waitlist/user" component={NeverlandWaitlist} />
                <Route exact path="/faq" component={NeverlandFAQ} />
                <Route exact path="/contactus" component={NeverlandContactUs} />
                <Route exact path="/seller-onboarding/reauth/:accountId" component={SellerOnboardingReAuth} />
                <Route exact path="/seller-onboarding/return/:accountId" component={SellerOnboardingRouting} />
                <Route path="/edit/product/:productId" component={AdminProductEdit} />
              </div>
            </Layout>
          </BrowserRouter>
        </Provider>
      </ParallaxProvider>
        );
  }
}

export default App;
