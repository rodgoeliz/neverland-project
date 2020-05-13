import React, { Component } from 'react';
import {Navbar, NavDropdown, Form, Button, FormControl} from 'react-bootstrap';

class Header extends Component {
	render() {
		let backgroundClass = "header-bg-yellow";
		if (window && window.location && window.location.pathname && (window.location.pathname.includes('story') || window.location.pathname.includes('waitlist'))){
			backgroundClass = "header-bg-beige";
		}
		return (
			<div className={"header " + backgroundClass}>
				<div className="row-nm">
						<div className="navbar-brand" style={{paddingLeft: '2em', paddingTop: '1em'}}>
							<a href="/"><h1><span className="swash">N</span>e<span className="ss-v">v</span>erla<span className="ss-n">n</span>d</h1></a>
						</div>
						<div className="neverland-header-nav">
						        <a class="nav-link" href="/story">Our Story<span class="sr-only">(current)</span></a>
						        <a class="nav-link" href="#plants">Plants</a>
								<button style={{marginTop: '4px'}} onClick={this.onClickWaitlist} className="neverland-button"> JOIN THE WAITLIST </button><br/>
						</div>
						</div>
			</div>);
	}
}

export default Header;