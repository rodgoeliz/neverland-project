import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getSellerAccountLinks, clearAccountLinks } from 'actions/seller';

import SellerLoadingPage from './SellerLoadingPage';

class SellerOnboardingReAuthWebPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    // clear our entire state
    await this.props.clearAccountLinks();
    await this.props.getSellerAccountLinks({ sellerId: this.props.user._id });
    if (this.props.accountLinks) {
      window.open(this.props.accountLinks.url);
    }
  }

  onSubmitForm() {}

  render() {
    return <SellerLoadingPage />;
  }
}

const mapStateToProps = (state) => ({
  user: state.auth,
  accountLinks: state.seller.accountLinks,
});

const actions = {
  clearAccountLinks,
  getSellerAccountLinks,
};

export default connect(mapStateToProps, actions)(SellerOnboardingReAuthWebPage);
