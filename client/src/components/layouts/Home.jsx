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
                TEST
              </h2>
            </div>
            <p>
              Test page
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  waitlist: state.waitlist,
});

export default connect(mapStateToProps, { joinWaitlist })(Home);
