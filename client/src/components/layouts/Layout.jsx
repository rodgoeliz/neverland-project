import React, { Component } from 'react';
import Header from '../Header.jsx';
import Footer from '../Footer.jsx';

class Layout extends Component {
	render() {
    let pathName = window.location.pathname;
    if (pathName.includes('seller/onboarding')) {
      return (
      <div>
        {this.props.children }
      </div>
      ) 
    } else {
      return (
        <div>
          <Header />
          <div> {this.props.children} </div>
          <Footer />
        </div>);
      }
	}
}

export default Layout;