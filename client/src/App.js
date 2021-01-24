import React, { Component } from 'react';
import { Route, BrowserRouter, Switch } from "react-router-dom"
import { Provider } from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react'

import AOS from 'aos';

import './App.scss';

import Layout from 'components/layouts/Layout';
import Home from 'components/layouts/Home';

import store from './store/store';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  componentDidMount() {  }

  render() {
    AOS.init();
    return (
      <Provider store={store.store}>
        <PersistGate loading={null} persistor={store.persistor}>
          <BrowserRouter>
              <Layout className="App">
                <Switch>
                  <Route exact path="/" component={Home} />
                </Switch>
              </Layout>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
