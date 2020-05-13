import React, { Component } from 'react';

class Header extends Component {
	render() {
		return (
			<div className="header">
				<div style={{paddingTop: '1em', textAlign: 'center'}}>
							<h1><span className="swash">N</span>e<span className="ss-v">v</span>erla<span className="ss-n">n</span>d</h1>
				</div>
			</div>);
	}
}

export default Header;