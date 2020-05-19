import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Redirect} from "react-router-dom";
import queryString from 'query-string';
import { joinWaitlist } from "../../actions/waitlist";

class ModernBasketRewardsHome extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fIndex: 0,
			emailInput: '',
			emailError: "",
			isSubmitting: false ,
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

	genFunction() {
		let functions = ["aging", "life", "stress", "sleep"];
		return (
				<span>{functions[this.state.fIndex]}</span>
		);
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
		let message = "";
		if (this.props.waitlist) {
			message = this.props.waitlist.message;
		}
		if (this.state.redirect) {
			return (<Redirect to="/immunity/blue/waitlist" />);
		}
		if (this.state.isSubmitting) {
			return <div>Joining the waitlist...</div>;
		}
		return (
			<div> 	
				<div className="row-nm">
					<div>
							<h1>Discover the hottest healthy food brands and get rewarded.</h1>
							<h2>Shop and share with friends and get automatically rewarded.</h2>
							<input onChange={this.onChangeInput} className="immunity-input" value={this.state.emailInput}/>
							<button onClick={this.onClickWaitlist} className="botanica-button btn-lg"> JOIN WAITLIST </button><br/>
							<span>{this.state.emailError}</span>
					</div>
					<div>IMAGE HERE</div>
				</div>
				<div className="row-nm">
					<h2> How it works </h2>
					<div className="row-nm">
						<div>
							<img src=""/>
							<span>Discover relevant brands</span>
						</div>
						<div>
							<img src=""/>
							<span>Shop and share with friends</span>
						</div>
						<div>
							<img src=""/>
							<span>Earn cash rewards</span>
						</div>
					</div>
				</div>
				<div>
					<h2>From your snacks to your netflix n' chill</h2>
					<div>
						<div>keto carbs</div>
						<div>cbd infused bevs</div>
						<div>sober-curious</div>
						<div>mealkits</div>
					</div>
				</div>
				<div>
					<div>
						Personalized just for you
					</div>
					<div>image</div>
				</div>
				<div>
					<div>
						Get in on the latest pre-sales and free samples
					</div>
					<div>image</div>
				</div>
				<div>
					<div>
						Never get bored. Try something new.
					</div>
					<div>image</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		waitlist: state.waitlist
	}
}

export default connect(mapStateToProps, {joinWaitlist})(ModernBasketRewardsHome);