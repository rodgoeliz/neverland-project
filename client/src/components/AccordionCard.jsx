import React, { Component } from 'react';
import {Accordion, Card} from 'react-bootstrap';

class AccordionCard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			open: false
		}
	}

	onClick() {
		this.setState({open: !this.state.open});
	}

	render() {
		let iconClass =  "fa-plus";
		if (this.state.open) {
			iconClass = "fa-minus";
		}
		return (
				<Card>
					<Card.Header>
						<Accordion.Toggle as={Card.Header} onClick={this.onClick.bind(this)} style={{width: '100%', backgroundColor: 'transparent', border: 'none'}} variant="link" eventKey={this.props.eventKey}>
							<div className="accordion-title-container">
								<span className="question">{this.props.title}</span>
								<span className={`fas ${  iconClass}`} />
							</div>
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey={this.props.eventKey}>
						<Card.Body> {this.props.children} </Card.Body>
					</Accordion.Collapse>
				</Card>
		);
	}
}

export default AccordionCard;