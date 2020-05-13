import React, {Component} from 'react';
import {Route, BrowserRouter} from "react-router-dom"
import { Provider } from 'react-redux';
import store from './store/store';
import logo from './logo.svg';
import './App.scss';
import NeverlandHome from './components/layouts/NeverlandHome';
import NeverlandOurStory from './components/layouts/NeverlandOurStory';
import NeverlandWaitlist from "./components/layouts/NeverlandWaitlist";
import Layout from './components/layouts/Layout';

class App extends Component {
  render() {
    console.log(process.env)
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Layout className="App">
            <div className="App">
              <Route exact path="/" component={NeverlandHome} />
              <Route exact path="/story" component={NeverlandOurStory} />
              <Route exact path="/waitlist/user" component={NeverlandWaitlist} />
            </div>
          </Layout>
        </BrowserRouter>
      </Provider>
        );
  }
}

export default App;
