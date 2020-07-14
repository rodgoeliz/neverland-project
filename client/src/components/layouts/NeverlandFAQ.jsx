import React, { Component } from 'react';
import Header from '../Header.jsx';
import Footer from '../Footer.jsx';
import {Accordion, Card, Button} from 'react-bootstrap';
import AccordionCard from '../AccordionCard';

class NeverlandFAQ extends Component {
	render() {
		return (
			<div className="faq-container">
			<div className="row-nm">
				<div className="col-md-8">
					<div className="faq-section">
						<div><h3 className="h3-cognace faq-section-title">General</h3></div>
						<Accordion> 
							<AccordionCard eventKey="0" title="I've never grown a plant before. Is Neverland right for me?">
							 There’s no such thing as a black thumb. It’s normal for questions to arise such as: “How do I choose a plant? How much light does my plant need? How often do I have to water it? What happens if I forget? Is fertilizer necessary, and how often should I use it? How can I tell when I need to repot my plant? What kind of soil should I use? Why are the leaves turning brown, and where did these bugs come from?” If you’ve ever wondered about the answer to any of these questions, you’ve come to the right place. Neverland will use tech to take you step by step through the basics, teaching you how to care for—and love!—your houseplants.
							</AccordionCard>
							<AccordionCard eventKey="1" title="How do plants improve air quality?">
							Thanks to oft-cited studies by NASA and other organizations, we now know that many plants can improve air quality, reducing the volatile organic compounds (VOCs), such as formaldehyde, benzene, and trichloroethylene, in indoor air. Linked to a range of health problems, VOCs can be found in carpet, upholstery, paints, cleaning products, aerosol sprays, and other commonly used items in the home.
							</AccordionCard>
							<AccordionCard eventKey="2" title="How do plants improve well-being?">
							A study in 2015 found that interacting with indoor plants can measurably reduce psychological and physiological stress, and a 2009 study found that plants enhanced the outcomes of surgery patients. In prisons, retirement homes, juvenile detention centers, and veterans’ homes, horticultural therapy is growing as a practice to help those dealing with post-traumatic stress disorder, anxiety, depression, and other issues.
							</AccordionCard>
							<AccordionCard eventKey="3" title="What is the number one killer of plants?">
							Overwatering. Almost no plant wants to sit in soggy soil; it can lead to a fungal infection called root rot that will eventually kill your plant. Inconsistent watering can also stress out a plant, making it more vulnerable to pests and other diseases. 
							</AccordionCard>
							<AccordionCard eventKey="4" title="What is the Neverland app?">
							Our app is a free, direct line to Neverland. It’s open to all—not just Neverland customers. We send personalized and plant-specific reminders to help your plants thrive. We also help you set up and keep track of your plants so you don’t have to. Questions? We’re here to help and take you step-by-step. No sweat. 
							</AccordionCard>
						</Accordion>
					</div>
					<div className="faq-section">
						<div><h3 className="h3-cognace faq-section-title">Shipping & Product</h3></div>
						<Accordion> 
							<AccordionCard eventKey="5" title="Where does Neverland ship?">
							We currently ship within the contiguous US to all 48 states.
							</AccordionCard>
							<AccordionCard eventKey="6" title="How much does shipping cost?">

							<ul>
								<li>Orders under $30: $2.99 flat shipping fee</li>
								<li>Orders over $30: free shipping. </li>
								Please note shipping rates and options can differ during holiday seasons and poor weather conditions.
							</ul>

							</AccordionCard>
							<AccordionCard eventKey="7" title="What is your return policy?">
								At this time, Neverland does not accept returns, but we do guarantee that every product will arrive in great condition and germinate. If your seeds do not germinate, email us at help@enterneverland.com to get a replacement. 
							</AccordionCard>
							<AccordionCard eventKey="8" title="My order arrived damaged, what do I do?">
								Every product is fragile and the shipping process is not always kind (or easy!). When this happens, we fix it whether it’s a damaged product or due to shipping carrier mishandling. If any of your products arrive damaged and your purchase was made less than 30 days ago, please have your order number and photo of your damaged product ready. Then, let us know via help@enterneverland.com so we can ship a replacement for you as soon as possible.
							</AccordionCard>
							<AccordionCard eventKey="9" title="How does the satisfaction guarantee work?">
								We guarantee your plant will sprout within each plant-specific maturity timeline or you will qualify for an exchange. All of our seeds have a 99% germination rate. Please contact us at help@enterneverland.com with any further questions. 
							</AccordionCard>
						</Accordion>
					</div>
				</div>
				<div className="col-md-4">
					<div className="faq-contact-section">
						<h4 className="h4-cognace faq-contact-title"> Contact us </h4>
						<div></div>
						<div>
							Email us! <br/>
							<b>hi@enterneverland.com</b><br/><br />

							We're online 9am-6pm PST, Monday through Friday.
						</div>
					</div>
				</div>
			</div>
			</div>
			);
	}
}

export default NeverlandFAQ;