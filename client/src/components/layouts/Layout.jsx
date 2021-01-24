import React from 'react';

import Header from 'components/Header';
import Footer from 'components/Footer';

function Layout({children}){
    const pathName = window.location.pathname;
    if (pathName.includes('seller/onboarding') || pathName.includes('seller/logout')) {
      return (
      <div>
        {children}
      </div>
      ) 
    } 
      return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
          <Header />
          <div style={{flex: 1}}> {children} </div>
          <Footer />
        </div>);
      
}

export default Layout;