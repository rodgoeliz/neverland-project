import React, { Component } from 'react';
import Header from '../Header.jsx';
import Footer from '../Footer.jsx';
import {Accordion, Card, Button} from 'react-bootstrap';
import AccordionCard from '../AccordionCard';

class NeverlandContactUs extends Component {
  render() {
    return (
      <div>
        <h1 style={{'text-align': 'center', marginTop: '2em', marginBottom: '1em'}}>Contact Us</h1>
        <div style={{display: 'flex', 'flex-direction': 'column', 'justify-content': 'center', 'align-items': 'center', marginBottom: '2em'}}>
        <div style={{maxWidth: 800, 'margin-left': '2em', 'margin-right': '2em', 'justify-content': 'center', 'align-items': 'center'}}>
          <div><h3 className="h3-cognace faq-section-title">Interested in joining our seller community?</h3></div>
          <div>
            <p> Please <a href="https://enterneverland.typeform.com/to/bVKM8aYR">apply here to join</a>.</p>
          </div>
          <div><h3 className="h3-cognace faq-section-title">Press</h3></div>
          <div>
            <p> For press inquiries, please email <a href="mailto:press@enterneverland.com">press@enterneverland.com</a> </p>
          </div>
          <div><h3 className="h3-cognace faq-section-title">Partnership Inquiries</h3></div>
          <div>
            <p> Have a partnership or collaboration inquiry? Please email our marketing team directly at <a href="mailto:partnerships@enterneverland.com">partnerships@enterneverland.com</a></p>
          </div>
          <div><h3 className="h3-cognace faq-section-title">Influencers / Ambassadors </h3></div>
          <div>
            <p>For inquiries, please email <a href="mailto: hello@enterneverland.com">hello@enterneverland.com</a></p>
          </div>
          <div><h3 className="h3-cognace faq-section-title">Careers</h3></div>
          <div>
            <p>If you're intersted in joining our growing Neverland team, please check and follow our LinkedIn page for opportunities and email careers@enterneverland.com.</p>
          </div>
          <div><h3 className="h3-cognace faq-section-title">Need order help?</h3></div>
            <p> Check out our FAQ page or email our support team <a href="mailto:support@enterneverland.com">support@enterneverland.com</a></p>
        </div>
        </div>
      </div>
      );
  }
}

export default NeverlandContactUs;