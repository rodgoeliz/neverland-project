import React, { Component } from 'react';
import Header from '../Header.jsx';
import Footer from '../Footer.jsx';
import {Redirect} from "react-router-dom";
import queryString from 'query-string';
import { connect } from 'react-redux';
import { launchAppReAuth } from "../../actions/seller";

class SellerOnboardingReAuth extends Component {

	constructor(props) {
		super(props);
		this.state = {
		}
	}
	componentDidMount() {
		window.open('nvlnd://seller-onboarding/reauth/' + params.accountId);
	}

	render() {
		return (
			<div>
				<p> Redirecting you to Neverland app...</p>
			</div>);
	}
}

const mapStateToProps = state => {
	return {
	}
}

export default connect(mapStateToProps, {launchAppReAuth})(SellerOnboardingReAuth);
