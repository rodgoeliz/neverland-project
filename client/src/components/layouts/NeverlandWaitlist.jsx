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
					<h1>Group 1</h1>
					<input className="neverland-input-referral" ref={(referralurl) => this.referralUrl=referralurl} value={referralUrl} />
					<button style={{marginLeft: '4px'}} onClick={this.onClickCopy.bind(this)} className="neverland-button"> COPY </button><br/>
				</div>
				<div className="waitlist-referral-rewards">
					<h1 className="h1-cognace">Referral Rewards</h1>
					<p>Share the love with you friends and get free plants.</p>
					<div className="row-nm waitlist-referral-reward-info">
						<div className="col-sm-3">
							<div><img className="referral-rewards-number" src="/images/referral_one.png" /></div>
							<div className="referral-rewards-desc">Get an invite to our VIP community</div>
						</div>	
						<div className="col-sm-3">
							<div><img  className="referral-rewards-number"  src="/images/referral_five.png" /></div>
							<div className="referral-rewards-desc">Get bumped up by 5 groups</div>
						</div>	
						<div className="col-sm-3">
							<div><img className="referral-rewards-number" src="/images/referral_ten.png" /></div>
							<div className="referral-rewards-desc">Get bumped up to group 1</div>
						</div>	
						<div className="col-sm-3">
							<div><img className="referral-rewards-number" src="/images/referral_fifty.png" /></div>
							<div className="referral-rewards-desc">Get two free plant packs</div>
						</div>	
					</div>
					<div>
						<a href="">Current Referrals</a>	
						{this.renderStatus()}
					</div>
				</div>			
				<div>
				<img className="our-story-monologo" src="/images/neverland_splash_logo.png" />
				<div className="our-story-parent-container">
					<div className="our-story-container">
							<center><h1 className="h1-cognace"><span className="swash">O</span>u<span className="swash">r</span> <span className="swash">S</span>tory</h1>	</center>
							<br/>
							<br/>
							<h4>A personalized, tech-powered experience to connect people with nature from the ground up. </h4>
							<br />
							<h4><b>Why We Started Neverland</b></h4>
							<p>
								We wanted a better plant-growing experience. Like so many people, we struggled with keeping plants alive and thriving in our small city apartments. We’d go to a store, find a plant (okay, more like five plants) that we liked, and bring them home. Quality was always questionable, sustainability was non-existent, and we struggled to learn how to properly take care of our new friends to their detriment.
							</p>
							<p>
								The plant industry hasn’t evolved since the 60s. It’s ruled by massive conventional superstores or incredibly overpriced boutiques—and you’re stuck with these choices. An overwhelming majority of plants are grown using conventional fertilizers and pesticides. We got frustrated and fed up with poor quality products, conventionally grown and not sustainable options, and terrible customer experience.
							</p>
							<p>
								We know the experience of buying, growing, and caring for plants can be different. Plants can be sourced from organic farms that value sustainability and practice regenerative agriculture, not conventional factories. Technology can be infused in the experience to make growing and taking care of plants easy and fun. 
								Plants meet tech. We help people connect with nature from the ground up. 	
							</p>
							<br />
							<h4>
								<b>
								Our Mission
								</b>
							</h4>
							<p>
								In our increasingly urbanized and technology-dependent lifestyles, it’s more important than ever to rediscover a closer relationship with nature. Neverland is a modern plant company powered by technology and community. Our mission is to connect people with nature to improve overall well-being through the power of plants and technology. 
							</p>
							<br />
							<h4>
								<b>Awaken to the new gold standard of quality </b>
							</h4>
							<p>All of our seeds, greenery, soils, and plant foods are produced by small, organic farmers that are leading the way in sustainability, regenerative agriculture, and premium quality. Sustainability is a top priority for us. 
							</p>
							<br />
							<h4>
								<b>Powered by technology</b>
							</h4>
							<p>
								We’re modernizing the plant industry using technology to bring the remarkable benefits of nature into homes. Starting with our personalized plant-specific reminders and support, Neverland utilizes tech to take you step-by-step through the basics, teaching you how to care for—and love!—your plants. Our app is sprouting soon.
							</p>
							<br/>
							<h4><b>A little T(ender) L(ove) C(are)</b></h4>
							<p>
								Plants are the antidote to modern day stressors and bring joy and beauty to our living and working spaces. Studies have shown that plants improve air quality, reduce stress, boost immunity, improve mental health and well-being, increase productivity, and can even help patients recover from injury more quickly. 
							</p>
							<br />
							<h4><b>Analog over digital</b></h4>
							<p>
							We’re all about integrating more of nature into our lives, delighting in growing things, and inspiring people to connect, appreciate, and protect the natural world. Welcome to your urban oasis destination.
							</p>
							<br/>
							<br/>
						<h1> <span className="swash ss-v">V</span>era & <span className="swash">H</span>ayley </h1>
					</div>
				</div>
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
