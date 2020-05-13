import React, { Component } from 'react';
import {Navbar, NavDropdown, Form, Button, FormControl} from 'react-bootstrap';

class Footer extends Component {
	render() {
		return (
			<div className="footer" style={{margin: '4em'}}>
				<div className="row-nm">
					<div className="col-sm-6">
						<div className="row">
							<img className="footer-logo" src="/images/neverland_monologo_black.png" />
							<div className="footer-nav">
								<a className="col" href="">Join the waitlist</a>
								<a className="col" href="/story">Our story</a>
								<a className="col" href="">Contact us</a>
							</div>
						</div>
					</div>
					<div className="col-sm-6">
						<div className="col">
							<p style={{fontSize: '12px', fontWeight: 'bold'}}>Get in on the grapevine</p>
							<div style={{display: 'flex'}}>
								<input className="neverland-input-footer" placeholder="Slide into my emails!"/>
								<button style={{marginLeft: '4px'}} onClick={this.onClickWaitlist} className="neverland-button-black"> SIGNUP </button><br/>
							</div>
							<div> 
								<a href=""><img className="neverland-icon" src="/images/facebook_logo.svg"/></a>
								<a href=""><img className="neverland-icon" src="/images/instagram_logo.svg"/></a>
							</div>
						</div>
					</div>
				</div>
			</div>);
	}
}

export default Footer;