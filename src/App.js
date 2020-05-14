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
import Layout from './components/layouts/Layout';
import {ParallaxProvider} from "react-scroll-parallax";

class App extends Component {
  render() {
    console.log(process.env)
    return (
      <ParallaxProvider>
        <Provider store={store}>
          <BrowserRouter>
            <Layout className="App">
              <div className="App">
                <Route exact path="/" component={NeverlandHome} />
                <Route exact path="/story" component={NeverlandOurStory} />
                <Route exact path="/waitlist/user" component={NeverlandWaitlist} />
                <Route exact path="/faq" component={NeverlandFAQ} />
              </div>
            </Layout>
          </BrowserRouter>
        </Provider>
      </ParallaxProvider>
        );
  }
}

export default App;
