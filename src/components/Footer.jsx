import React, { Component } from 'react';
import {Navbar, NavDropdown, Form, Button, FormControl} from 'react-bootstrap';

class Footer extends Component {
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