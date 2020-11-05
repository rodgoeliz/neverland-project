import React, {Component} from 'react';
import { connect } from 'react-redux';

class DownloadNeverland extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fIndex: 0

    }
  }

  componentDidMount() {

  }

  genFunction() {
    let functions = ["aging", "life", "stress", "sleep"];
    return (
        <span>{functions[this.state.fIndex]}</span>
    );
  }

  onClickWaitlist() {
    window.location = "https://docs.google.com/forms/d/e/1FAIpQLSeZcRVCsn-_cOXdcMyjEfR7PQ9N536zi0NGdVZRbcfE4KUCpg/viewform"
  }

  render() {
    let message = "";
    if (this.props.waitlist) {
      message = this.props.waitlist.message;
    }
    return (
      <div> 
          <div className="row-nm hero-container">
                  <a class="btn-download" href="itms-services://?action=download-manifest&url=https://www.enterneverland.com/download/manifest.plist">Download</a>
                </div>
              {/*}    <img style={{width: '100%'}}src="./images/hero_image_one.png"/>*/}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    waitlist: state.waitlist
  }
}

export default connect(mapStateToProps, {})(DownloadNeverland);