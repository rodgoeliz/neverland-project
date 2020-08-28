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
			window.scrollTo(0,0);
			return (<Redirect to="/waitlist/user" />);
		}
		if (this.state.isSubmitting) {
			return <div className="join-waitlist-loading">Joining the waitlist...</div>;
		}
		return (
			<div className="testest" style={{marginTop: '-5em'}}> 	
				<div className="row-nm neverland-header">
					<div className="graphics">
						<img className="neverland-header-img" src="/images/neverlandheader.png"/>
						<img className="cloud" src="/images/cloud_one.png" />
						<img className="mist display-desktop" src="/images/mist.png" />
						<img className="cloud_two display-desktop" src="/images/cloud_two.png" />
						<img className="door" src="/images/door.png" />
						<img className="chairplant" src="/images/heroimage.png" />
					</div>
					<div className="neverland-header-container" style={{paddingTop: '1em'}}>
						<br/>
						<br/>
							<h1><span className="swash">G</span>row an urban oasis that <span className="ss-n">n</span>e<span className="ss-v">v</span>e<span className="swash">r</span> sta<span className="ss-n">n</span>ds still</h1>
							<h4><span className="swash">G</span>ardening reimagined and made easy for modern city life.</h4>
							<br/>
							<input onChange={this.onChangeInput} placeholder="Enter your email" className="neverland-input" value={this.state.emailInput}/>
							<button style={{marginTop: '4px'}} onClick={this.onClickWaitlist} className="neverland-button"> JOIN THE WAITLIST </button><br/>
							<span>{this.state.emailError}</span>
							<div className="display-mobile" style={{minHeight: 300}}>
								<img className="chairplant_small" src="/images/heroimage.png" />
							</div>
					</div>
				</div>
				{/*}
				<div className="row-nm" style={{marginLeft: '2em', marginTop: '2em', marginRight: '2em'}}>
					<h2 className="h2-cognace" style={{margin: 'auto'}}> How it works </h2>
					<div className="row-nm">
						<div className="col-md-4 step-container">
							<img className="step-pick" src="/images/vp_pick.gif"/>
							<span className="step-subtitle">STEP 1</span>
							<h4 className='h4-cognace step-title' style={{textAlign: 'center'}}><span className="swash">P</span>ick</h4>
							<p className="step-desc">
								We’re <span className="green-bold">mint</span> to be. Choose a plant you’d like to grow and we’ll send you a grow pack with everything you need delivered right to your doorstep. 💌
							</p>
						</div>
						<div className="col-md-4 step-container">
							<img className="step-pick" src="/images/vp_plant.png"/>
							<span className="step-subtitle">STEP 2</span>
							<h4 className="h4-cognace step-title" style={{textAlign: 'center'}}><span className="swash">P</span>lant</h4>
							<p className="step-desc">Unbox your plant pack and follow our easy breezy instructions for planting your new friend. Make sure to pot it like it's hot.🔥</p>
						</div>
						<div className="col-md-4 step-container">
							<img className="step-pick" src="/images/vp_grow.png"/>
							<span className="step-subtitle">STEP 3</span>
							<h4 className="h4-cognace step-title" style={{textAlign: 'center'}}><span className="swash">G</span>row</h4>
							<p className="step-desc">Romaine calm, we’re here to kelp. We’ll send personalized plant-specific reminders, plant puns, and tips to keep your plants happy and thriving. Our app is sprouting soon to help you grow your new besties! We’re rootin’ for ya! 🌱</p>
						</div>
					</div>
				</div>
				<div>
					<img className="neverland-divider" src="images/neverlandimage1.png" />
					<div className="row-nm new-take-container" >
						<div className="col-md-6 new-take-title-container">
						<h2 className="h2-cognace new-take-title"> A new take on gardening </h2>
						</div>
						<div className="col-md-6 new-take-description">
						<p> 
						 In our increasingly urbanized and technology-dependent lifestyles, it's more important than ever to rediscover a closer relationship with nature. 
						 Gardening hasn't evolved since the 60's. It's ruled by massive conventional superstores or incredibly overpriced boutiques - and you're stuck with these choices. 
						 Today, growing can be overwhelming, time consuming, and just too confusing. Our grow packs make growing your own plants and food easy breezy. Combined with our app,
						 we're taking the stress out of growing. We want you to worry less about killing the plant, and enjoy the fruits of your labor, literally.
						 </p>

						</div>
					</div>
				</div>
				<hr />
				<br />
				<br />*/}
				{/*}
				<div className="row-nm">
					<div className="col-md-8 elevate-img-sm" style={{textAlign: 'center', margin: 'auto'}}> <img width="90%" src="/images/nvlnd_gif"/></div>
					<div className="col-md-4 elevate-container">
						<div>
							<h4 className="h4-cognace">Elevate your life.</h4>
							<p> Bring life to your space, your cooking, and your social life. Our organic grow packs help you add a bit of spice to your day, everyday whether you're cooking, making mocktails, or elevating your space.</p>

							<h4 className="h4-cognace">Grow your own organic food. </h4>	
							<p> From seed to table: all natural, organic ingredients. No pesticides, no artificial ingredients. We source from USDA Organic, small farmers accross USA </p> 

							<h4 className="h4-cognace">Create your own self-care oasis.</h4>	
							<p> Plants and gardening make us feel more connected to nature and to something bigger than ourselves. They lift our mood and make us feel happy.</p>
						</div>

					</div>
					<div className="col-md-8 elevate-img-lg" style={{textAlign: 'center', margin: 'auto'}}> <img width="90%" src="/images/nvlnd_gif"/></div>
				</div>
				<div>
				<br/>
					<br/>
					<br/>
					<br/>
				<br/>
					<h1 id="plants" className="h1-cognace" style={{textAlign: 'center'}}>Let’s Grow Together</h1>
					<p style={{textAlign: 'center'}}>Delight in growing with our Organic Grow Packs </p>
					<p style={{textAlign: 'center', marginBottom: '2em'}}>Coming Soon</p>

					<div className="row-nm" style={{margin: 'auto'}}>
						<div className="col-md-6 plant-pack-square-blue">
							<div className="col-md-6" data-aos="fade-right" data-aos-delay="200" data-aos-duration="1000"><img data-aos="fade-right" style={{width:'100%'}}src="images/blue_tomato.png"/></div>
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
									<input onChange={this.onChangeInput} placeholder="Enter your email" className="input-group-prepend neverland-input neverland-input-yellow" value={this.state.emailInput}/>
									<button onClick={this.onClickWaitlist} className="neverland-button-yellow"> JOIN THE WAITLIST </button><br/>
								</div>
						</div>
						<div className="col-md-6 plant-pack-square-green">
							<div className="col-md-6 " data-aos="fade-left" data-aos-delay="200" data-aos-duration="1000"><img style={{width:'100%'}}src="images/green_strawberry.png"/></div>
							<h2 className="h2-cognace"><span className="swash">S</span>oozy</h2>
							<p>Strawberries | <i>Fragaria ananassa</i></p>
							<h4 className="h4-secondary">Sweet, flavorful berries to savor all summer long.</h4>
							<ul>
								<li> Likes full sun and germinates in 21-28 days.</li>
								<li> Days to maturity: 120 days.</li>
								<li> Non-GMO and USDA Certified Organic</li>
							</ul>
							<p> One kit includes: Pot, Seed Starter Pod, Seeds, Soil, Pamphlet, Access to our app. </p>

							<input onChange={this.onChangeInput} placeholder="Enter your email" className="neverland-input" value={this.state.emailInput}/>
							<button onClick={this.onClickWaitlist} className="neverland-button"> JOIN THE WAITLIST </button><br/>
						</div>
					</div>

					<div className="row-nm" style={{margin: 'auto'}}>
						<div className="col-md-6 plant-pack-square-maroon">
						<div className="col-md-6" data-aos="fade-right" data-aos-delay="200" data-aos-duration="2000"><img style={{width:'100%'}}src="images/peacelily.png"/></div>
							<h2 className="h2-cognace"><span className="swash">C</span>allie</h2>
							<p>Peace Lily | <i>Spathiphyllum</i></p>
							<h4 className="h4-secondary"> This low-maintenance houseplant produces gorgeous white blossoms and glossy leaves.</h4>
							<ul>
								<li> Named by NASA as one of the top air-purifying plants.</li>
								<li> Likes bright light and tolerates low light. Germinates in 15 days.</li>
								<li> Days to maturity: 100 days.</li>
							</ul>
							<p> One kit includes: Pot, Seed Starter Pod, Seeds, Soil, Pamphlet, Access to our app. </p>
							<input placeholder="Enter your email" onChange={this.onChangeInput} className="neverland-input" value={this.state.emailInput}/>
							<button onClick={this.onClickWaitlist} className="neverland-button"> JOIN THE WAITLIST </button><br/>
						</div>
						<div className="col-md-6 plant-pack-square-yellow">
							<div className="col-md-6 " data-aos="fade-left" data-aos-delay="200" data-aos-duration="2000"><img style={{width:'100%'}}src="images/yellow_basil.png"/></div>
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
							<input placeholder="Enter your email" onChange={this.onChangeInput} className="neverland-input" value={this.state.emailInput}/>
							<button onClick={this.onClickWaitlist} className="neverland-button"> JOIN THE WAITLIST </button><br/>
						</div>
					</div>*/}
				<div className="row-nm" style={{minHeight: '80vh'}}>
					<div className="col-md-6 display-mobile" style={{margin: 'auto'}}>
						<div className="nvlnd-about-main-background-box" />
						<div className="nvlnd-about-main-background-box-bottom" />
						<div className="nvlnd-about-main-background-box" />
						<div className="nvlnd-about-main-background-box" />
						<img className="app-img" src="/images/neverland_about_main.jpeg"/></div>	
					<div className="col-md-6 app-container">
						<h2 className="h2-cognace">About Neverland</h2>
							<p>						
						Neverland is the online destination for plants and gardening. Buyers can discover new plants and gardening products, book gardening services online, and get inspired. Plant and gardening professionals can sell their products, connect with new buyers, and build their business. 	
							</p>
					</div>	
					<div className="col-md-6 display-desktop" style={{margin: 'auto'}}>
						<div className="nvlnd-about-main-background-box" />
						<div className="nvlnd-about-main-background-box-bottom" />
					<img className="app-img" src="/images/neverland_about_main.jpeg"/></div>	
				</div>
				<br/>
					<br/>
				<div className="row-nm" style={{minHeight: '80vh'}}>
					<div className="col-md-6 display-desktop" style={{margin: 'auto'}}><img className="app-img" src="/images/neverland_app.png"/></div>	
					<div className="col-md-6 app-container">
						<h2 className="h2-cognace">Romaine calm, we're here to kelp.</h2>
							<p>						
							Through our app you get direct messaging line to Neverland. 
It’s open to all—not just Neverland customers. We send personalized and plant-specific reminders to help your plants thrive. We keep track of your plants so you don’t have to. Questions? We’re here to help and take you step-by-step. No sweat.
							</p>
					</div>	
					<div className="col-md-6 display-mobile" style={{margin: 'auto'}}><img className="app-img" src="/images/neverland_app.png"/></div>	
				</div>
				<br/>
					<br/>
					{/*	
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
									<input onChange={this.onChangeInput} placeholder="Enter your email" className="input-group-prepend neverland-input neverland-input-yellow" value={this.state.emailInput}/>
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

							<input onChange={this.onChangeInput} placeholder="Enter your email" className="neverland-input" value={this.state.emailInput}/>
							<button onClick={this.onClickWaitlist} className="neverland-button"> JOIN THE WAITLIST </button><br/>
						</div>
						<div className="col-md-6 display-desktop" data-aos="fade-left" data-aos-delay="200" data-aos-duration="1000"><img style={{width:'100%', marginLeft: '-10%'}}src="images/green_strawberry.png"/></div>
					</div>
					<div className="row-nm plant-pack-row plant-pack-row-maroon"> 
						<div className="col-md-6" data-aos="fade-right" data-aos-delay="200" data-aos-duration="2000"><img style={{width:'110%', marginLeft: '-10%'}}src="images/peacelily.png"/></div>
						<div className="col-md-6 padding-right plant-container-blue padding-left-small" style={{margin: 'auto'}}>
							<h2 className="h2-cognace"><span className="swash">C</span>allie</h2>
							<p>Peace Lily | <i>Spathiphyllum</i></p>
							<h4 className="h4-secondary"> This low-maintenance houseplant produces gorgeous white blossoms and glossy leaves.</h4>
							<ul>
								<li> Named by NASA as one of the top air-purifying plants.</li>
								<li> Likes bright light and tolerates low light. Germinates in 15 days.</li>
								<li> Days to maturity: 100 days.</li>
							</ul>
							<p> One kit includes: Pot, Seed Starter Pod, Seeds, Soil, Pamphlet, Access to our app. </p>
							<input placeholder="Enter your email" onChange={this.onChangeInput} className="neverland-input" value={this.state.emailInput}/>
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
							<input placeholder="Enter your email" onChange={this.onChangeInput} className="neverland-input" value={this.state.emailInput}/>
							<button onClick={this.onClickWaitlist} className="neverland-button"> JOIN THE WAITLIST </button><br/>
						</div>
						<div className="col-md-6 display-desktop" data-aos="fade-left" data-aos-delay="200" data-aos-duration="2000"><img style={{width:'100%', marginLeft: '-10%'}}src="images/yellow_basil.png"/></div>
					</div>*/}
				{/*
					<div className="guarantee row-nm" style={{paddingBottom: '6em'}}>
						<div className="col-md-8" style={{margin: 'auto', textAlign: 'center'}}>
							<img width="90%" src="/images/nvlnd_growguarantee.png"/>
						</div>
						<div className="col-md-4" style={{margin: 'auto'}}>
							<div className="satisfaction-container">
								<h3 className="h3-cognace">Our <span className="swash">G</span>row <span className="swash">G</span>uarantee</h3>	
								<p> 
								We offer a 100% satisfaction guarantee. Check out our <a href="/faq">FAQ</a> page for more information.
								</p>
						</div>
					</div>
				</div>
					*/}
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