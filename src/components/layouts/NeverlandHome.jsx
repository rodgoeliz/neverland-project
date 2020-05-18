import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Redirect} from "react-router-dom";
import queryString from 'query-string';
import { joinWaitlist, joinNewsletter } from "../../actions/waitlist";


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
			<div className="testest" style={{marginTop: '-5em'}}> 	
				<div className="row-nm neverland-header">
					<div className="graphics">
						<img className="neverland-header-img" src="/images/neverlandheader.png"/>
						<img className="cloud" src="/images/cloud_one.png" />
						<img className="mist" src="/images/mist.png" />
						<img className="cloud_two" src="/images/cloud_two.png" />
						<img className="door" src="/images/door.png" />
						<img className="chairplant" src="/images/heroimage.png" />
					</div>
					<div className="neverland-header-container" style={{paddingTop: '1em'}}>
						<br/>
						<br/>
							<h1><span className="swash">G</span>row an urban oasis that <span className="ss-n">n</span>e<span className="ss-v">v</span>e<span className="swash">r</span> sta<span className="ss-n">n</span>ds still</h1>
							<h4><span className="swash">D</span>elight in growi<span className="ss-n">n</span>g with our starter plant packs.</h4>
							<br/>
							<input onChange={this.onChangeInput} className="neverland-input" value={this.state.emailInput}/>
							<button style={{marginTop: '4px'}} onClick={this.onClickWaitlist} className="neverland-button"> JOIN THE WAITLIST </button><br/>
							<span>{this.state.emailError}</span>
							<div className="display-mobile" style={{minHeight: 300}}>
								<img className="chairplant_small" src="/images/heroimage.png" />
							</div>
					</div>
				</div>
				<div className="row-nm" style={{marginLeft: '2em', marginTop: '2em', marginRight: '2em'}}>
					<h2 className="h2-cognace" style={{margin: 'auto'}}> How it works </h2>
					<div className="row-nm">
						<div className="col-md-4 step-container">
							<img className="step-pick" src="/images/vp_pick.gif"/>
							<span className="step-subtitle">STEP 1</span>
							<h4 className='h4-cognace step-title' style={{textAlign: 'center'}}><span className="swash">P</span>ick</h4>
							<p className="step-desc">We're mint to be. Choose a plant you'd like to grow and we'll send you a pack with everything you need delivered to your door.</p>
						</div>
						<div className="col-md-4 step-container">
							<img className="step-pick" src="/images/vp_plant.png"/>
							<span className="step-subtitle">STEP 2</span>
							<h4 className="h4-cognace step-title" style={{textAlign: 'center'}}><span className="swash">P</span>lant</h4>
							<p className="step-desc">Unbox your plant pack and follow our easy breezy instructions for planting your new friend. Make sure to pot it like it's hot.</p>
						</div>
						<div className="col-md-4 step-container">
							<img className="step-pick" src="/images/vp_grow.gif"/>
							<span className="step-subtitle">STEP 3</span>
							<h4 className="h4-cognace step-title" style={{textAlign: 'center'}}><span className="swash">G</span>row</h4>
							<p className="step-desc">Romaine calm, we're here to kelp. Text our plantline for a good time and any questions you have. We'll send text reminders, plant puns and tips to keep your plant happy. We're rooting for you.</p>
						</div>
					</div>
				</div>
				<div>
					<img className="neverland-divider" src="images/neverland_divider.png" />
				</div>
				<div className="row-nm">
					<div className="romaine-calm-container col-md-6">
						<div style={{maxWidth: 500, margin: 'auto'}}>
							<h2 className="h2-cognace">Romaine calm, we're here to kelp.</h2>
							<p>Never kill a plant again with our plant hotline. Reminders to water, fertilize, and repot your plants. Text us with any questions. Keep track of your plants in one place.</p>
						</div>
					</div>
					<div data-aos="fade-left" data-aos-delay="200" data-aos-duration="1000" className="col-md-6"><img style={{width: '80%'}}src="/images/neverland_textline.png"/></div>
				</div>
				<div>
				<br/>
					<br/>
					<br/>
				<br/>
					<h1 id="plants" className="h1-cognace" style={{textAlign: 'center'}}>Our Organic Grow Plant Packs</h1>
					<p style={{textAlign: 'center', marginBottom: '2em'}}>Delight in growing by starting with one of our seed plant packs.</p>
					<div className="row-nm plant-pack-row plant-pack-row-blue" style={{margin: 'auto'}}>
						<div className="col-md-6" data-aos="fade-right" data-aos-delay="200" data-aos-duration="1000"><img data-aos="fade-right" style={{width:'100%', marginLeft: '-10%'}}src="images/blue_tomato.png"/></div>
						<div className="col-md-6 padding-right plant-container-blue padding-left-small" style={{margin: 'auto'}}>
							<h2 className="h2-cognace"><span className="swash">C</span>herie</h2>
							<p>Cherry Tomato| <i>Lycoperiscon esculentum</i></p>
							<h4 className="h4-secondary">Truly tasty cherry tomatoes perfect for salads or snacking. </h4>
							<ul>
								<li>A great source of lycopene and other phytonutrients. </li>
								<li>Likes full sun and germinates in 6-12 days.</li>
								<li>Days to maturity: 70-90 days.</li>
								<li> Non-GMO and USDA Certified Organic</li>
							</ul>
							<p> One kit includes: Pot, Seed Starter Pod, Seeds, Soil, Pamphlet, Access to our app. </p>
							  	<div className="input-group">
									<input onChange={this.onChangeInput} className="input-group-prepend neverland-input neverland-input-yellow" value={this.state.emailInput}/>
									<button onClick={this.onClickWaitlist} className="neverland-button-yellow"> JOIN THE WAITLIST </button><br/>
								</div>
						</div>
					</div>

					<div className="row-nm plant-pack-row plant-pack-row-green plant-container-yellow">
						<div className="col-md-6 display-mobile"><img style={{width:'100%', marginLeft: '-10%'}} src="images/green_strawberry.png"/></div>
						<div className="col-md-6 padding-left padding-right" style={{margin: 'auto'}}>
							<h2 className="h2-cognace"><span className="swash">S</span>oozy</h2>
							<p>Strawberries | <i>Fragaria ananassa</i></p>
							<h4 className="h4-secondary">Sweet, flavorful berries to savor all summer long.</h4>
							<ul>
								<li> Likes full sun and germinates in 21-28 days.</li>
								<li> Days to maturity: 120 days.</li>
								<li> Non-GMO and USDA Certified Organic</li>
							</ul>
							<p> One kit includes: Pot, Seed Starter Pod, Seeds, Soil, Pamphlet, Access to our app. </p>

							<input onChange={this.onChangeInput} className="neverland-input" value={this.state.emailInput}/>
							<button onClick={this.onClickWaitlist} className="neverland-button"> JOIN THE WAITLIST </button><br/>
						</div>
						<div className="col-md-6 display-desktop" data-aos="fade-left" data-aos-delay="200" data-aos-duration="1000"><img style={{width:'100%', marginLeft: '-10%'}}src="images/green_strawberry.png"/></div>
					</div>
					<div className="row-nm plant-pack-row plant-pack-row-maroon"> 
						<div className="col-md-6" data-aos="fade-right" data-aos-delay="200" data-aos-duration="2000"><img style={{width:'110%', marginLeft: '-10%'}}src="images/red_chili.png"/></div>
						<div className="col-md-6 padding-right plant-container-blue padding-left-small" style={{margin: 'auto'}}>
							<h2 className="h2-cognace"><span className="swash">C</span>allie</h2>
							<p>Cayenne Pepper| <i>Capsicum annuum</i></p>
							<h4 className="h4-secondary"> These dark-green spicy peppers ripen to red and are perfect for pickling and cooking.</h4>
							<ul>
								<li> Likes full sun and germinates in 6-15 days.</li>
								<li> Days to maturity: 72 days.</li>
								<li> Non-GMO and USDA Certified Organic</li>
							</ul>
							<p> One kit includes: Pot, Seed Starter Pod, Seeds, Soil, Pamphlet, Access to our app. </p>
							<input onChange={this.onChangeInput} className="neverland-input" value={this.state.emailInput}/>
							<button onClick={this.onClickWaitlist} className="neverland-button"> JOIN THE WAITLIST </button><br/>
						</div>
					</div>


					<div className="row-nm plant-pack-row plant-pack-row-yellow plant-container-yellow">
						<div className="col-md-6 display-mobile"><img style={{width:'100%', marginLeft: '-10%'}}src="images/yellow_basil.png"/></div>
						<div className="col-md-6 padding-left padding-right " style={{margin: 'auto'}}>
							<h2 className="h2-cognace"><span className="swash">B</span>anjo</h2>
							<p>Italian Basil | <i>Ocimum basilicum</i></p>
							<h4 className="h4-secondary">Sweet and fragrant classic Italian Basil</h4>
							<ul>
								<li> Rich in vitamin K and beta-carotene and has natural anti-inflammatory properties</li>
								<li> Likes full sun and germinated in 5-11 days.</li>
								<li> Days to maturity: 65-75 days.</li>
								<li> Non-GMO and USDA Certified Organic</li>
							</ul>
							<p> One kit includes: Pot, Seed Starter Pod, Seeds, Soil, Pamphlet, Access to our app. </p>
							<input onChange={this.onChangeInput} className="neverland-input" value={this.state.emailInput}/>
							<button onClick={this.onClickWaitlist} className="neverland-button"> JOIN THE WAITLIST </button><br/>
						</div>
						<div className="col-md-6 display-desktop" data-aos="fade-left" data-aos-delay="200" data-aos-duration="2000"><img style={{width:'100%', marginLeft: '-10%'}}src="images/yellow_basil.png"/></div>
					</div>
					<div className="guarantee">
						<div className="guarantee-container">
						<h3 className="h3-cognace">Our <span className="swash">G</span>row <span className="swash">G</span>uarantee</h3>	
						<p> We want you to succeed, which is why we offer 100% satisfaction guarantee. If your seeds don't sprout or something goes
						wrong with the plant by the time it gets to you, we'll replace everything, free of charge.</p>
						</div>
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

export default connect(mapStateToProps, {joinWaitlist, joinNewsletter})(NeverlandHome);