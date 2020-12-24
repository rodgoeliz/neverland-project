import React from 'react';

import { Accordion } from 'react-bootstrap';

import AccordionCard from 'components/AccordionCard';

function NeverlandFAQ() {
  return (
    <div className="faq-container">
      <div className="row-nm">
        <div className="col-md-8">
          <div className="faq-section">
            <div>
              <h3 className="h3-cognace faq-section-title">General</h3>
            </div>
            <Accordion>
              <AccordionCard eventKey="0" title="What is Neverland?">
                <p>
                  Neverland is an e-commerce plant and gardening marketplace making nature accessible to all. By
                  connecting more people with the magic of nature, Neverland aims to inspire people everywhere to
                  protect the natural world.
                </p>
                <p>
                  Neverland is reimagining gardening and plant care, and making it easy for folks from the plant curious
                  to the experienced gardener. Technology-backed, Neverland is the online destination for plants and
                  gardening where buyers can discover new horticulture products, and plant and gardening professionals
                  can connect with new buyers and build their businesses.
                </p>
              </AccordionCard>
              <AccordionCard eventKey="1" title="How does Neverland work?">
                <p>
                  <b>1.Discover:</b>
                  <br />
                  Discover and shop plant and gardening products personalized to your lifestyle and unique environment.
                  Orders arrive in two-three days with Priority Mail shipping with our grow guarantee.
                </p>
                <p>
                  <b>2.Grow:</b>
                  <br />
                  Discover and shop plant and gardening products personalized to your lifestyle and unique environment.
                  Orders arrive in two-three days with Priority Mail shipping with our grow guarantee.
                </p>
                <p>
                  <b>3.Thrive:</b>
                  <br />
                  With every purchase, Neverland donates "Jack and the Beanstalk" magic beans to underprivileged schools
                  in food insecure areas to give children their first experience with horticulture and inspire the next
                  generation to protect our planet.
                </p>
              </AccordionCard>
              <AccordionCard eventKey="2" title="How can I apply to be a seller?">
                <p>
                  Thanks for your interest in joining our seller community! Please{' '}
                  <a href="https://enterneverland.typeform.com/to/bVKM8aYR">apply here</a> and a member of our team will
                  be in touch with you within 24 hours.
                </p>
              </AccordionCard>
              <AccordionCard eventKey="3" title="Who can I contact about press opportunities?">
                <p>
                  Please contact <a href="mailto:press@enterneverland.com">press@enterneverland.com.</a>
                </p>
              </AccordionCard>
              <AccordionCard eventKey="4" title="Where does Neverland ship?">
                <p>
                  Neverland ships within the contiguous US to all 48 states. We’ll be launching in other areas soon.
                  Sign up for our waitlist here to be first to know when we launch in your area!
                </p>
              </AccordionCard>
              <AccordionCard eventKey="6" title="Are you hiring?">
                <p>Yes, we are!</p>
              </AccordionCard>
              <AccordionCard eventKey="7" title="Do you offer gift cards?">
                <p>Yes, gift cards are available for purchase through the Neverland app.</p>
              </AccordionCard>
              <AccordionCard
                eventKey="8"
                title="Can we work together for an upcoming event/activation/cool thing I'm planning?"
              >
                <p>
                  We’d love to hear from you. Please email{' '}
                  <a href="mailto:hello@enterneverland.com">hello@enterneverland.com</a>.
                </p>
              </AccordionCard>
            </Accordion>
          </div>
        </div>
        <div className="col-md-4">
          <div className="faq-contact-section">
            <h4 className="h4-cognace faq-contact-title"> Contact us </h4>
            <div />
            <div>
              Email us! <br />
              <b>
                <a href="mailto:hello@enterneverland.com">hello@enterneverland.com</a>
              </b>
              <br />
              <br />
              We're online 9am-6pm PST, Monday through Friday.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NeverlandFAQ;
