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
    //window.location = "https://docs.google.com/forms/d/e/1FAIpQLSeZcRVCsn-_cOXdcMyjEfR7PQ9N536zi0NGdVZRbcfE4KUCpg/viewform"
    window.location = "items-services://?action=download-manifest&url=localhost:3000/download/manifest.plist"
  }

  render() {
    let message = "";
    if (this.props.waitlist) {
      message = this.props.waitlist.message;
    }
    return (
      <div> 
      <div class="section hero">
          <div class="container">
            <div class="row">
              <div class="one-half column">
                <h5 class="">Enterprise In-House App distribution.</h5>
                <a class="button button-primary" href="itms-services://?action=download-manifest&url=https://www.dropbox.com/s/3r3l9h4pd3su3r2/manifest.plist?dl=0">Download Your App</a>
              </div>
            </div>
          </div>
        </div>
          <div className="row-nm hero-container">
                  <a class="btn-download" href="itms-services://?action=download-manifest&url=https://localhost:3000/download/manifest.plist">Download</a>
                    <button onClick={this.onClickWaitlist} className="botanica-button btn-lg"> JOIN WAITLIST </button>
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