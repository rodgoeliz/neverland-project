import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Redirect} from "react-router-dom";
import {Parallax} from 'react-scroll-parallax';
import queryString from 'query-string';
import { joinWaitlist } from "../../actions/waitlist";

class NeverlandHome extends Component {
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
			return (<Redirect to="/waitlist/user" />);
		}
		if (this.state.isSubmitting) {
			return <div>Joining the waitlist...</div>;
		}
		return (
			<div style={{marginTop: '-5em'}}> 	
				<div className="row-nm neverland-header">
					<div className="graphics">
						<img className="neverland-header-img" src="/images/neverlandheader.png"/>
						<img className="cloud" src="/images/cloud_one.png" />
						<img className="mist" src="/images/mist.png" />
						<img className="cloud_two" src="/images/cloud_two.png" />
						<img className="door" src="/images/door.png" />
						<img className="chairplant" src="/images/chairandplant.png" />
					</div>
					<div className="neverland-header-container">
						<br/>
						<br/>
							<h1><span className="swash">G</span>row an oasis that <span className="ss-n">n</span>e<span className="ss-v">v</span>e<span className="swash">r</span> sta<span className="ss-n">n</span>ds still</h1>
							<h4><span className="swash">D</span>elight in growi<span className="ss-n">n</span>g with our plant packs.</h4>
							<br/>
							<input onChange={this.onChangeInput} className="neverland-input" value={this.state.emailInput}/>
							<button style={{marginTop: '4px'}} onClick={this.onClickWaitlist} className="neverland-button"> JOIN THE WAITLIST </button><br/>
							<span>{this.state.emailError}</span>
							<div className="display-mobile" style={{minHeight: 300}}>
								<img className="chairplant_small" src="/images/chairandplant.png" />
							</div>
					</div>
				</div>
				<div className="row-nm" style={{marginLeft: '2em', marginTop: '2em', marginRight: '2em'}}>
					<h2 className="h2-cognace" style={{margin: 'auto'}}> How it works </h2>
					<div className="row-nm">
						<div className="col-md-4 step-container">
							<img className="step-pick" src="/images/pickplant.gif"/>
							<span className="step-subtitle">STEP 1</span>
							<h4 className='h4-cognace step-title' style={{textAlign: 'center'}}><span className="swash">P</span>ick</h4>
							<p className="step-desc">We're mint to be. Choose a plant you'd like to grow and we'll send you a pack with everything you need delivered to your door.</p>
						</div>
						<div className="col-md-4 step-container">
							<img className="step-pick" src="/images/step-plant.png"/>
							<span className="step-subtitle">STEP 2</span>
							<h4 className="h4-cognace step-title" style={{textAlign: 'center'}}><span className="swash">P</span>lant</h4>
							<p className="step-desc">Unbox your plant pack and follow our easy breezy instructions for planting your new friend. Make sure to pot it like it's hot.</p>
						</div>
						<div className="col-md-4 step-container">
							<img className="step-pick" src="/images/step-grow.gif"/>
							<span className="step-subtitle">STEP 3</span>
							<h4 className="h4-cognace step-title" style={{textAlign: 'center'}}><span className="swash">G</span>row</h4>
							<p className="step-desc">Romaine calm, we're here to kelp. Text us at 1800PartyThyme for a good time and any questions you have. We'll send text reminders, plant puns and tips to keep your plant happy. We're rooting for you.</p>
						</div>
					</div>
				</div>
				<div>
					<img className="neverland-divider" src="images/neverlandivider.png" />
				</div>
				<div className="row-nm">
					<div className="romaine-calm-container col-md-6">
						<div style={{maxWidth: 500, margin: 'auto'}}>
							<h2 className="h2-cognace">Romaine calm, we're here to kelp.</h2>
							<p>Never kill a plant again with our plant hotline. Reminders to water, fertilize, and repot your plants. Text us with any questions. Keep track of your plants in one place.</p>
						</div>
					</div>
					<div className="col-md-6"><img style={{width: '80%'}}src="/images/neverland_textline.png"/></div>
				</div>
				<div style={{position: 'absolute'}}>
					<Parallax  y={[30, -160]} tagOuter="figure">
					</Parallax>
				</div>
				<div>
				<br/>
				<br/>
					<h1 id="plants" className="h1-cognace" style={{textAlign: 'center'}}>Our Plant Packs</h1>
					<p style={{textAlign: 'center', marginBottom: '2em'}}>Delight in growing by starting with one of our young plant packs.</p>
					<div className="row-nm plant-pack-row plant-pack-row-blue">
						<div className="col-md-6"><img style={{width:'100%', marginLeft: '-10%'}}src="images/neverland_monty.png"/></div>
						<div className="col-md-6 padding-right plant-container-blue padding-left-small">
							<h2 className="h2-cognace"><span className="swash">M</span>onty</h2>
							<p>Monstera | <i>Monstera Deliciousa</i></p>
							<h4 className="h4-secondary">Instant jungle vibes. This tropical plant is lively and wild.</h4>
							<p>This easy-to-care-for tropical plant is the stuff of stylish design blogs and enviable social media feeds. It grows fast, and quickly can become a floor-standing focal point, its grandeur imbuing your indoor space with a sense of peace and calm. 
							  The Monstera originates from the tropical rainforests of southern Mexico and is extremely adaptable to indoor conditions. It’s heart-shaped leaves develop holes as it matures and it loves bright, indirect light.
							  </p>
							  	<div className="input-group">
									<input onChange={this.onChangeInput} className="input-group-prepend neverland-input neverland-input-yellow" value={this.state.emailInput}/>
									<button onClick={this.onClickWaitlist} className="neverland-button-yellow"> JOIN THE WAITLIST </button><br/>
								</div>
						</div>
					</div>

					<div className="row-nm plant-pack-row plant-pack-row-green plant-container-yellow">
						<div className="col-md-6 display-mobile"><img style={{width:'100%', marginLeft: '-10%'}}src="images/snakeplantpot.png"/></div>
						<div className="col-md-6 padding-left padding-right">
							<h2 className="h2-cognace"><span className="swash">S</span>oozy</h2>
							<p>Snake Plant | <i>Sansevieria</i></p>
							<h4 className="h4-secondary">A bulletproof succulent and the queen of air purifying plants.</h4>
							<p>
							The snake plant is native to the arid deserts of West Africa and has stiff, upright, sword-like leaves. It’s a natural choice for people who love modern and contemporary design. If you were to choose just one plant to aid respiratory problems, this is the one to pick. NASA research has shown that snake plants purifies and cleans indoor areas by removing toxins such as formaldehyde and benzene. Since it produces oxygen mainly at night, it makes an excellent bedroom companion. It’s also one of the easiest plants to grow successfully.
							  </p>

							<input onChange={this.onChangeInput} className="neverland-input" value={this.state.emailInput}/>
							<button onClick={this.onClickWaitlist} className="neverland-button"> JOIN THE WAITLIST </button><br/>
						</div>
						<div className="col-md-6 display-desktop"><img style={{width:'100%', marginLeft: '-10%'}}src="images/snakeplantpot.png"/></div>
					</div>
					<br/>
					<br/>
					<h1 id="plants" className="h1-cognace" style={{textAlign: 'center'}}>Our Seed Starter Packs</h1>
					<p style={{textAlign: 'center', marginBottom: '2em'}}>Delight in growing from the roots up with our easy breezy seed starter packs.</p>
					<div className="row-nm plant-pack-row plant-pack-row-maroon">
						<div className="col-md-6"><img style={{width:'110%', marginLeft: '-10%'}}src="images/african_violet.png"/></div>
						<div className="col-md-6 padding-right plant-container-blue padding-left-small">
							<h2 className="h2-cognace"><span className="swash">A</span>lfie</h2>
							<p>African Violet | <i>Saintpaulia</i></p>
							<h4 className="h4-secondary">Pleasantly fuzzy leaves and perky flowers.</h4>
							<p>
							This delicate continuously flowering beauty was first discovered by the British in Tanzania. Its flowers come in a variety of shades of violet, although it can grow white in the wild and feel velvety to the touch. It’s thick fleshy leaves have fine, hair-like soft fur. 
							  </p>
							<input onChange={this.onChangeInput} className="neverland-input" value={this.state.emailInput}/>
							<button onClick={this.onClickWaitlist} className="neverland-button"> JOIN THE WAITLIST </button><br/>
						</div>
					</div>


					<div className="row-nm plant-pack-row plant-pack-row-yellow plant-container-yellow">
						<div className="col-md-6 display-mobile"><img style={{width:'100%', marginLeft: '-10%'}}src="images/mintobe.png"/></div>
						<div className="col-md-6 padding-left padding-right ">
							<h2 className="h2-cognace"><span className="swash">M</span>inty</h2>
							<p>Mint | <i>Mentha</i></p>
							<h4 className="h4-secondary">Bright green and stimulating. This fragrant herb boosts energy.</h4>
							<p>
With its bright green fragrant leaves, clean bright flavor, and stimulating scent, mint is as pretty as useful in the kitchen. Make soothing teas, desserts, drinks, and chilled soups. Mint can help boost energy levels as well as lift our mood.
							  </p>
							<input onChange={this.onChangeInput} className="neverland-input" value={this.state.emailInput}/>
							<button onClick={this.onClickWaitlist} className="neverland-button"> JOIN THE WAITLIST </button><br/>
						</div>
						<div className="col-md-6 display-desktop"><img style={{width:'100%', marginLeft: '-10%'}}src="images/mintobe.png"/></div>
					</div>
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

export default connect(mapStateToProps, {joinWaitlist})(NeverlandHome);