import React, { Component } from 'react';
import Header from '../Header.jsx';
import Footer from '../Footer.jsx';

class NeverlandWaitlist extends Component {
	render() {
		return (
			<div>
				<img src="images/n_waitlist_hero.png" />
				<div>
					You are in 
					Group 1
					<input/> <button> copy</button>
				</div>
				<div>
					<h1 className="h1-cognace">Referral Rewards</h1>
					<div className="row-nm">
						<div className="col-sm-3">
							<div>Image of One</div>
							<div>Get an invite to our VIP community</div>
						</div>	
						<div className="col-sm-3">
							<div>Image of Five</div>
							<div>Get an invite to our VIP community</div>
						</div>	
						<div className="col-sm-3">
							<div>Image of Ten</div>
							<div>Get an invite to our VIP community</div>
						</div>	
						<div className="col-sm-3">
							<div>Image of Fifty</div>
							<div>Get an invite to our VIP community</div>
						</div>	
					</div>
				</div>			
				<div>
				<img className="our-story-monologo" src="/images/neverland_splash_logo.png" />
				<div className="our-story-parent-container">
					<div className="our-story-container">
						<center><h1 className="h1-cognace"><span className="swash">O</span>u<span className="swash">r</span> <span className="swash">S</span>tory</h1>	</center>
						<br/>
						<br/>
						<p>
							Plants meet tech. We help people connect with nature from the ground up. 	
						</p>
						<p>
							In our increasingly urbanized and technology-dependent lifestyles, it’s more important than ever to rediscover a closer relationship with nature. 	
						</p>
						<p>
							Plants are the antidote to modern day stressors. Studies have shown that plants improve air quality, reduce stress, boost immunity, improve mental health, increase productivity, and can even help patients recover from injury more quickly. 	
						</p>
						<p>
							Neverland is a modern plant company powered by technology and community. Our mission is to connect people with nature to improve overall well-being through the power of plants. 
						</p>
						<p>
							We’re modernizing the plant industry using technology to bring the remarkable benefits of nature into homes. We’re all about integrating more of nature into our lives and helping others find delight in growing things. Welcome to your urban oasis destination.
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

export default NeverlandWaitlist;