import React, { Component } from 'react';
import Header from '../Header.jsx';

class Layout extends Component {
	render() {
		return (
			<div>
				<Header />
				<div> {this.props.children} </div>
				<div> </div>
			</div>);
	}
}

export default Layout;