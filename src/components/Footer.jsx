import React, { Component } from 'react';
import queryString from 'query-string';
import {Navbar, NavDropdown, Form, Button, FormControl} from 'react-bootstrap';

class Footer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			emailInput: '',
			emailError: "",
			isSubmitting: false,
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

	componentDidUpdate(prevProps, prevState) {
		let waitlistUser = this.props.waitlist.waitlistUser;
		if (waitlistUser && waitlistUser.referralCode) {
			this.setState({
				redirect: true
			})
		}
	}


	validateEmail(email) {
    	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(String(email).toLowerCase());
	}

	onClickWaitlist() {
		//validate email
		if (this.validateEmail(this.state.emailInput)) {
			this.props.joinWaitlist(this.state.emailInput, this.state.inviter);
			this.setState({
				"emailError": "",
				isSubmitting: true
			});
		} else {
			this.setState({"emailError": "Please enter valid email"})
		}
		//window.location = "https://docs.google.com/forms/d/e/1FAIpQLSeZcRVCsn-_cOXdcMyjEfR7PQ9N536zi0NGdVZRbcfE4KUCpg/viewform"
	}

	onChangeInput(event) {
		this.setState({
			emailInput: event.target.value 
		});
	}
	render() {
		return (
			<div className="footer-container">
			<div className="footer">
				<div className="row-nm">
					<div className="col-sm-6">
						<div className="row">
							<img className="footer-logo" src="/images/neverland_monologo_yellow.png" />
							<div className="footer-nav">
								<a className="col" href="">Join the waitlist</a>
								<a className="col" href="/story">Our story</a>
								<a className="col" href="">Contact us</a>
							</div>
						</div>
					</div>
					<div className="col-sm-6">
						<div className="" style={{marginTop: '1em'}}>
							<p style={{fontSize: '12px', fontWeight: 'bold', color: '#1e1dcd', marginBottom: -2}}>Get in on the grapevine</p>
							<div style={{display: 'flex', flexDirection: 'column'}}>
								<input className="neverland-input-footer" placeholder="Slide into my emails!"/>
								<button style={{marginLeft: '4px'}} onClick={this.onClickWaitlist} className="neverland-button-yellow"> SIGNUP </button><br/>
							</div>
							<div> 
								<a href=""><img className="neverland-icon" src="/images/fb_icon.svg"/></a>
								<a href=""><img className="neverland-icon" src="/images/ig_icon.svg"/></a>
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

export default Footer;