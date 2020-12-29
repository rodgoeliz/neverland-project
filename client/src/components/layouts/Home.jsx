import React, { Component } from 'react';
import { connect } from 'react-redux';

import { joinWaitlist } from 'actions/waitlist';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fIndex: 0,
    };
  }

  componentDidMount() {
    this.props.joinWaitlist();
  }

  genFunction() {
    const functions = ['aging', 'life', 'stress', 'sleep'];
    return <span>{functions[this.state.fIndex]}</span>;
  }

  onClickWaitlist() {
    window.location =
      'https://docs.google.com/forms/d/e/1FAIpQLSeZcRVCsn-_cOXdcMyjEfR7PQ9N536zi0NGdVZRbcfE4KUCpg/viewform';
  }

  render() {
    return (
      <div>
        <div className="row-nm hero-container">
          <div className="col-md-12 hero-text-container">
            <div className="hero-func-content">
              <h2>
                {' '}
                Modern botanicals for <span style={{ padding: 4 }} />
              </h2>
              <div className="hero-fun-wrap">
                <span className="hero-fun-span">aging</span>
                <span className="hero-fun-span">stress</span>
                <span className="hero-fun-span">sleep</span>
                <span className="hero-fun-span">focus</span>
                <span className="hero-fun-span">immunity</span>
              </div>
            </div>
            <p
              style={{
                maxWidth: 500,
                margin: 'auto',
                justifyContent: 'center',
                textAlign: 'center',
                lineHeight: '1em',
                paddingBottom: '1em',
              }}
            >
              Botanicā makes science-backed, botanical medicinals to help you thrive.{' '}
            </p>
            <div style={{}}>
              <button onClick={this.onClickWaitlist} className="botanica-button btn-lg">
                {' '}
                JOIN WAITLIST{' '}
              </button>
            </div>
          </div>
          {/* }		<img style={{width: '100%'}}src="./images/hero_image_one.png"/> */}
        </div>
        <div />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  waitlist: state.waitlist,
});

export default connect(mapStateToProps, { joinWaitlist })(Home);
