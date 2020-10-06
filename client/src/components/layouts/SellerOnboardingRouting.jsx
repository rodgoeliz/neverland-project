import React, { Component } from 'react';
import Header from '../Header.jsx';
import Footer from '../Footer.jsx';
import {Redirect} from "react-router-dom";
import queryString from 'query-string';
import { connect } from 'react-redux';

class SellerOnboardingRouting extends Component {

	constructor(props) {
		super(props);
		this.state = {
		}
	}
	
	async componentDidMount() {
		const { match: {params}} = this.props;
		window.location = 'nvlnd://seller-onboarding/return/' + params.accountId;
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
