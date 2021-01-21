import React from 'react';
import { Redirect } from 'react-router-dom';

import Layout from 'components/layouts/seller/dashboard/SellerDashboardAddProductPage';

export default function SellerDashboardAddProductPageContainer({}) {
  const [redirectTo, setRedirectTo] = useState(null);

  const onCloseThisPage = () => {
    setRedirectTo('/seller/dashboard/products');
  }

  render() {
    if (redirectTo) {
      return <Redirect to={redirectTo} />;
    }
    return (
      <Layout onClose={onCloseThisPage}/>
    );
  }
}

