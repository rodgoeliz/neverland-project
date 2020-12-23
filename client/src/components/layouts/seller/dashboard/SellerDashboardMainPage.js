import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import NButton from '../../../UI/NButton';
import { Spinner } from 'react-bootstrap';
import BrandStyles from "../../../BrandStyles";
import { loginFirebase } from '../../../../actions/auth';
import SellerDashboardNavWrapper from './SellerDashboardNavWrapper';

const styles = {
  container: {
    backgroundColor: BrandStyles.color.beige,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
};

class SellerDashboardMainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (
      <SellerDashboardNavWrapper>
        <div>
          MAIN DASHOARD PAGE
        </div>
      </SellerDashboardNavWrapper>
      );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps, {loginFirebase})(SellerDashboardMainPage);
