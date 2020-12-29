import React, { Component } from 'react';

import Burger from "./Burger";
import Menu from "./Menu";

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
		}
	}

	setOpen(open) {
		this.setState({open});
	}

	render() {
    if (window && window.location && window.location.pathname && (window.location.pathname.includes('seller/dashboard'))) {

      return (<div />);
    } 
		let backgroundClass = "header-bg-yellow";
		if (window && window.location && window.location.pathname && (window.location.pathname.includes('story') || window.location.pathname.includes('waitlist'))){
			backgroundClass = "header-bg-beige";
		}
		return (
			<div className={`header ${  backgroundClass}`}>
				<div className="row-nm" style={{justifyContent: 'space-between'}}>
						<div className="navbar-brand" style={{paddingLeft: '2em', paddingTop: '1em', paddingBottom: '1em'}}>
							<div className="display-desktop">
								<a href="/"><h1><span className="swash">N</span>e<span className="ss-v">v</span>erla<span className="ss-n">n</span>d</h1></a>
							</div>
							<div className="display-mobile">
								<a href="/"><img className="mobile-nav-logo" src="/images/neverland_monologo_black.png" /></a>
							</div>
						</div>
						<div className="row-nm">
								<div className="desktop-menu row-nm" style={{margin: 'auto'}}>
                    <a className="nav-link" href="/faq">FAQ<span className="sr-only">(current)</span></a>
                    <a className="nav-link" href="/contactus">Contact Us<span className="sr-only">(current)</span></a>
						        </div>
						        <div className="mobile-menu">
									<Burger open={this.state.open} setOpen={this.setOpen.bind(this)}/>
									<Menu open={this.state.open} setOopen={this.setOpen.bind(this)} />
								</div>
						</div>
						</div>
			</div>);
	}
}

export default Header;