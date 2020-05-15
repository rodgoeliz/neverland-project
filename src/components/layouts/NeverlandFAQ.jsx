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
							<AccordionCard eventKey="3" title="What is the number on killer of plants?">
							Overwatering. Almost no plant wants to sit in soggy soil; it can lead to a fungal infection called root rot that will eventually kill your plant. Inconsistent watering can also stress out a plant, making it more vulnerable to pests and other diseases. 
							</AccordionCard>
							<AccordionCard eventKey="4" title="What is the Plantline?">
							</AccordionCard>
						</Accordion>
					</div>
					<div className="faq-section">
						<div><h3 className="h3-cognace faq-section-title">Shipping & Product</h3></div>
						<Accordion> 
							<AccordionCard eventKey="5" title="Where does Neverland ship?">
							</AccordionCard>
							<AccordionCard eventKey="6" title="How much does shipping cost?">
							</AccordionCard>
							<AccordionCard eventKey="2" title="What is your return policy?">
							</AccordionCard>
							<AccordionCard eventKey="3" title="How does the satisfaction guarantee work?">
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