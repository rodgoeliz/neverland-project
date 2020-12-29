import React, { Component } from 'react';

import { connect } from 'react-redux';

class SellerOnboardingReAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    window.location = `nvlnd://seller-onboarding/reauth/${params.accountId}`;
  }

  render() {
    return (
      <div>
        <p> Redirecting you to Neverland app...</p>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {})(SellerOnboardingReAuth);
