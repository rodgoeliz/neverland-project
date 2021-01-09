import React from 'react';

import Header from 'components/Header';
import Footer from 'components/Footer';

function Layout({children}){
    const pathName = window.location.pathname;
    if (pathName.includes('seller/onboarding') || pathName.includes('seller/logout')) {
      return (
      <div>
        {children }
      </div>
      ) 
    } 
      return (
        <div>
          <Header />
          <div> {children} </div>
          <Footer />
        </div>);
      
}

export default Layout;