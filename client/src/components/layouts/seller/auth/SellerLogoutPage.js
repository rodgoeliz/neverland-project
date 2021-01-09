import React, { Component } from 'react';

import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

import { logoutFirebase } from 'actions/auth';


class SellerLogoutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.logoutFirebase();
    this.setState({
      redirectTo: '/seller/onboarding/auth'
    });
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to="/seller/onboarding/auth" />;
    }
    return (
      <div style={{height: '100vh'}}>
        <p> Logging out... </p>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {logoutFirebase})(SellerLogoutPage);
