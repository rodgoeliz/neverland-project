import React, { Component } from 'react';
import Header from '../Header.jsx';
import Footer from '../Footer.jsx';
import {Redirect} from "react-router-dom";
import queryString from 'query-string';
import { connect } from 'react-redux';
import { fetchWaitlistUser } from "../../actions/waitlist";

class NeverlandWaitlist extends Component {

	constructor(props) {
		super(props);
		this.state = {
		}
	}
	componentDidMount() {
	if (this.props && this.props.location) {
			const values = queryString.parse(this.props.location.search);
			console.log(values)
			if (values && values.referralCode) {
				this.setState({
				    referralCode: values.referralCode	
				});
				this.props.fetchWaitlistUser(values.referralCode);
			}
			this.setState({
				inviter: values.invite
			});
		}

	}
	onClickCopy() {
		this.referralUrl.select();
		document.execCommand('copy');
		this.setState({
			copyMessage: 'Copied!'
		});
	}
	renderStatus() {
		let status = [];
		if (this.props && this.props.waitlist.invitedUsers && this.props.waitlist.invitedUsers.length != 0)	 {
			this.props.waitlist.invitedUsers.map((user) => {
				status.push(<div>{user.email}</div>);
			});
			return (<div>{status}</div>);
		} else {
			return (<div>No referrals yet. Share the link to get started.</div>)
		}
	}
	renderInvitedUsers() {
		let addresses = []
		if (!this.props.waitlist || !this.props.waitlist.invitedUsers || (this.props.waitlist.invitedUsers &&this.props.waitlist.invitedUsers.length == 0)) {
			return (<div></div>)
		}
		if (this.props.waitlist.invitedUsers) {
			this.props.waitlist.invitedUsers.map((user) => {
				addresses.push(<div className="inviter-item">{user.email}</div>);
			})
		}
		return (
			<div className="row-nm" style={{display: 'flex', flexDirection: 'column'}}>
				<div style={{margin: 'auto', marginTop: '4em'}}>
					<h5><b>Invited Signups</b></h5>
					{addresses}
				</div>
			</div>);
	}

	render() {
		let referralCode = this.state.referralCode;
		if (this.props.waitlist.waitlistUser && !referralCode) {
			referralCode = this.props.waitlist.waitlistUser.referralCode;
			if (!referralCode && !this.props.waitlist.waitlistUser) {
				return (<Redirect to="/" />);
			}
		}
		let referralUrl = "http://www.enterneverland.com?invite=" + referralCode;	
		return (
			<div>
				<div style={{marginTop: '4em'}}>
					<img className="waitlist-hero" src="/images/n_waitlist_hero.png" />
				</div>
				<div className="col waitlist-status-container">
					<p>You are in </p>
					<h1>Welcome to your Neverland!</h1>
					<p style={{maxWidth: 500, margin: 'auto', paddingTop: 32, paddingBottom: 32}}> Stay tuned for updates about our launch coming up this Fall! Share your personalized referral link with your plant-fluencer friends so they can get in early.</p>
					<input className="neverland-input-referral" ref={(referralurl) => this.referralUrl=referralurl} value={referralUrl} />
					<button style={{marginLeft: '4px'}} onClick={this.onClickCopy.bind(this)} className="neverland-button"> COPY </button><br/>
				</div>
			</div>);
	}
}

const mapStateToProps = state => {
	return {
		waitlist: state.waitlist
	}
}

export default connect(mapStateToProps, {fetchWaitlistUser})(NeverlandWaitlist);
