import React, { Component } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import { joinNewsletter } from "actions/waitlist";

class Footer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			emailInput: '',
			emailError: "",
			inviter: ""

		}
		this.onClickWaitlist = this.onClickWaitlist.bind(this);
		this.onChangeInput= this.onChangeInput.bind(this);
	}

	componentDidMount() {
		if (this.props && this.props.location) {
			const values = queryString.parse(this.props.location.search);
			this.setState({
				inviter: values.invite
			});
		}
	}


	validateEmail(email) {
    	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(String(email).toLowerCase());
	}

	onClickWaitlist() {
		// validate email
		if (this.validateEmail(this.state.emailInput)) {
			this.props.joinNewsletter(this.state.emailInput, this.state.inviter);
			this.setState({
				"emailError": "",
			});
		} else {
			this.setState({"emailError": "Please enter valid email"})
		}
		// window.location = "https://docs.google.com/forms/d/e/1FAIpQLSeZcRVCsn-_cOXdcMyjEfR7PQ9N536zi0NGdVZRbcfE4KUCpg/viewform"
	}

	onChangeInput(event) {
		this.setState({
			emailInput: event.target.value 
		});
	}

	render() {
		let successMessage = "";
		if (this.props.waitlist && this.props.waitlist.newsletterSubmitSuccess) {
			successMessage = <span className="fas fa-check"> You're in!</span>;
		}
		return (
			<div className="footer-container">
			<div className="footer">
				<div className="row-nm">
					<div className="col-sm-6">
						<div className="row">
							<a href="/"><img className="footer-logo" src="/images/neverland_monologo_yellow.png" /></a>
							<div className="footer-nav">
								{/*
								<a className="col" href="/faq">FAQ</a>
								<a className="col" href="/story">Our story</a>
								<a className="col" href="mailto:help@enterneverland.com">Contact us</a>
							    */}
							</div>
						</div>
					</div>
					<div className="col-sm-6">
						<div className="" style={{marginTop: '1em'}}>
							<p style={{fontSize: '12px', fontWeight: 'bold', color: '#efe6d8'}}>Get in on the grapevine</p>
							<div style={{display: 'flex', flexDirection: 'column'}}>
								<input className="neverland-input-footer" onChange={this.onChangeInput} placeholder="Slide into my emails!"/>
								{successMessage}
								<button style={{marginLeft: '4px'}} onClick={this.onClickWaitlist} className="neverland-button-yellow"> SIGNUP </button><br/>
								{this.state.emailError}	
							</div>
							<div> 
								<a href="https://www.facebook.com/Neverland-106231717763721"><img className="neverland-icon" src="/images/fb_icon.svg"/></a>
								<a href="https://www.instagram.com/enterneverland"><img className="neverland-icon" src="/images/ig_icon.svg"/></a>
							</div>
						</div>
					</div>
				</div>
			</div>
				<div style={{textAlign: 'center'}}>
					<span style={{fontSize: 10}}> &copy; www.enterneverland.com | Mango Labs, Inc | 2020</span>
				</div>
		</div>
			);
	}
}
const mapStateToProps = state => ({
		waitlist: state.waitlist
	})

export default connect(mapStateToProps, {joinNewsletter})(Footer);
