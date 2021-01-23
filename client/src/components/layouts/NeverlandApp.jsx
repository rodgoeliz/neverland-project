import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Redirect} from "react-router-dom";

/*eslint-disable*/
class NeverlandApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: '',
      emailError: "",
      isSubmitting: false ,
      inviter: "",
      carouselIndex: 0

    }
  }

  componentDidMount() {
  }

  componentDidUpdate() {
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
    return (
      <div>
        <a href="itms-services://?action=download-manifest&url=https://www.enterneverland.com/assets/manifest.plist">Install App</a>
      </div>
      )
  }
}

const mapStateToProps = state => ({
  })

export default connect(mapStateToProps, { })(NeverlandApp);