import React from 'react';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Alerts from 'components/UI/Alerts';

function Layout({children}){
    const pathName = window.location.pathname;
    if (pathName.includes('seller/onboarding') || pathName.includes('seller/logout')) {
      return (
      <div>
        {children }
        <Alerts />
      </div>
      ) 
    } 
      return (
        <div>
          <Header />
          <div> {children} </div>
          <Alerts />
          <Footer />
        </div>);
      
}

export default Layout;