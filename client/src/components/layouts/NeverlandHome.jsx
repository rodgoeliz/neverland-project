import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Redirect} from "react-router-dom";
import {Carousel} from 'react-bootstrap';
import queryString from 'query-string';

import { joinWaitlist, joinNewsletter } from "actions/waitlist";


class NeverlandHome extends Component {
	constructor(props) {
		super(props);
		this.state = {
			emailInput: '',
			emailError: "",
			isSubmitting: false ,
			inviter: "",
      carouselIndex: 0

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

	componentDidUpdate() {
		const {waitlistUser} = this.props.waitlist;
		if (waitlistUser && waitlistUser.referralCode) {
			this.setState({
				redirect: true
			})
		}
	}

	validateEmail(email) {
    	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(String(email).toLowerCase());
	}

	onClickWaitlist() {
		// validate email
		if (this.validateEmail(this.state.emailInput)) {
			this.props.joinWaitlist(this.state.emailInput, this.state.inviter);
			this.setState({
				"emailError": "",
				isSubmitting: true
			});
		} else {
			this.setState({"emailError": "Please enter valid email"})
		}
		// window.location = "https://docs.google.com/forms/d/e/1FAIpQLSeZcRVCsn-_cOXdcMyjEfR7PQ9N536zi0NGdVZRbcfE4KUCpg/viewform"
	}

	onChangeInput(event) {
		this.setState({
			emailInput: event.target.value 
		});
	}


  handleOnSelectNext(selectedIndex) {
    this.setState({
      carouselIndex: selectedIndex 
    });
  }

	render() {
		if (this.state.redirect) {
			window.scrollTo(0,0);
			return (<Redirect to="/waitlist/user" />);
		}
		if (this.state.isSubmitting) {
			return <div style={{justifyContent: 'center'}} className="join-waitlist-loading">Joining the waitlist...</div>;
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
							<h1><span className="swash">E</span>xperience the magic of the outdoors a<span className="ss-n">n</span>ywhere.</h1>
							<h4><span className="swash">N</span>everland is an e-commerce plant and gardening marketplace making nature accessible to all.</h4>
							<br/>
							<input onChange={this.onChangeInput} placeholder="Enter your email" className="neverland-input" value={this.state.emailInput}/>
							<button style={{marginTop: '4px'}} onClick={this.onClickWaitlist} className="neverland-button"> JOIN THE WAITLIST </button><br/>
							<span>{this.state.emailError}</span>
							<div className="display-mobile" style={{minHeight: 300}}>
								<img className="chairplant_small" src="/images/heroimage.png" />
							</div>
					</div>
				</div>
        <br />
        <br />
          <div><h2 className='h2-cognace' style={{'text-align': 'center'}}>How it works</h2></div>
          <Carousel activeIndex={this.state.carouselIndex} onSelect={this.handleOnSelectNext.bind(this)}>
            <Carousel.Item>
              <div className="row-nm carousel-item-content-container">
                <div className="col-md-6 carousel-item-text-col">
                    <div className="carousel-item-text-label">STEP 1</div>
                    <h2 className="h2-cognace-blue carousel-item-text-header">Discover</h2>
                    <div style={{width: '70%'}}>
                      <p>Discover and shop plant and gardening products personalized to your lifestyle and unique environment. Orders arrive in two or three days with Priority Mail shipping with our grow guarantee.</p>
                    </div>
                </div>
                <div className="col-md-6" style={{'text-align': 'center'}}>
                  <img className="carousel-item-image" src="/images/how_it_works_step_one.png" />
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="row-nm carousel-item-content-container">
                <div className="col-md-6 carousel-item-text-col">
                    <div className="carousel-item-text-label">STEP 2</div>
                    <h2 className="h2-cognace-blue carousel-item-text-header">Grow</h2>
                    <div style={{width: '70%'}}>
                      <p>
                        Receive plant-specific care guidance, reminders, and assistance so your new bud(dies) thrive through our app, powered by AI.
                      </p>
                    </div>
                </div>
                <div className="col-md-6" style={{'text-align': 'center'}}>
                  <img className="carousel-item-image" src="/images/how_it_works_step_two.png" />
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="row-nm carousel-item-content-container">
                <div className="col-md-6 carousel-item-text-col">
                    <div className="carousel-item-text-label">STEP 3</div>
                    <h2 className="h2-cognace-blue carousel-item-text-header">Thrive</h2>
                    <div style={{width: '70%'}}>
                      <p>
                        With every purchase, Neverland donates "Jack and the Beanstalk" magic beans to underprivileged schools in food insecure areas to give children their first experience with horticulture and inspire the next generation to protect our planet.
                      </p>
                    </div>
                </div>
                <div className="col-md-6" style={{'text-align': 'center'}}>
                  <img className="carousel-item-image" src="/images/how_it_works_step_three.png" />
                </div>
              </div>
            </Carousel.Item>
          </Carousel>
        <img style={{width: '100%'}} src="/images/neverland-divider.png" />
				<div className="row-nm" style={{minHeight: '80vh'}}>
					{/* <div className="col-md-6 display-mobile" style={{margin: 'auto'}}>
						<div className="nvlnd-about-main-background-box" />
						<div className="nvlnd-about-main-background-box-bottom" />
						<div className="nvlnd-about-main-background-box" />
						<div className="nvlnd-about-main-background-box" /> */}
					<div className="col-md-6 display-desktop" style={{margin: 'auto', 'text-align': 'center', 'align-items': 'center', 'justify-content': 'center'}}>
					   <img className="app-img" src="/images/about-neverland.png"/>
            </div>	
            <div className="col-md-6 app-container">
              <h2 className="h2-cognace">About Neverland</h2>
                <p>           
              Neverland is the online destination for plants and gardening. Buyers can discover new plants and gardening products, book gardening services online, and get inspired. Plant and gardening professionals can sell their products, connect with new buyers, and build their business.  
                </p>
            </div>  
          <div className="col-md-6 display-mobile" style={{margin: 'auto', 'text-align': 'center', 'align-items': 'center', 'justify-content': 'center'}}>
             <img className="app-img" src="/images/about-neverland.png"/>
            </div>  
				  </div>
				<br/>
					<br/>
			<br/>
					<br/>
			</div>
		);
	}
}

const mapStateToProps = state => ({
		waitlist: state.waitlist
	})

export default connect(mapStateToProps, {joinWaitlist, joinNewsletter})(NeverlandHome);