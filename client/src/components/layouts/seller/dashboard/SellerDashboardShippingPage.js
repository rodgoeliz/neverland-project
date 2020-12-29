import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import NButton from '../../../UI/NButton';
import NSelect from "../../../UI/NSelect";
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';
import BrandStyles from "../../../BrandStyles";
import BaseInput from "../../../UI/BaseInput";
import SellerDashboardNavWrapper from './SellerDashboardNavWrapper';
import { createPackageProfile, loadPackageProfiles, deletePackageProfile, updatePackageProfile } from '../../../../actions/shipping';
import isNumberValid from '../../../../utils/numberValidator';
import PACKAGE_PROFILES from '../../../../constants/packageProfiles';

const styles = {
  container: {
    backgroundColor: BrandStyles.color.beige,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
};

const TextAreaInput = styled.textarea`
  background-color: #F6F0E6;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border: 0px;
  border-bottom: 2px solid #1E1DCD !important;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  margin-top: 4px;
  padding-right: 16px;
  margin-left: 16px;
  margin-right: 32px;
  width: 100%;
  padding: 16px;
  height: 100px;
  display: flex;
  flex-direction: column;
  &:focus {
    outline: none
  } 
`;

class SellerDashboardShippingPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      edits: {},
      formData: {
      },
      errors: {

      }
    };
    this.addPackageProfile = this.addPackageProfile.bind(this);
    this.onUpdateProfile = this.onUpdateProfile.bind(this);
    this.onRemoveProfile = this.onRemoveProfile.bind(this);
    this._loadPackageProfiles = this._loadPackageProfiles.bind(this);
    this.onChangeBaseInput = this.onChangeBaseInput.bind(this);
    this.onPackageSizeSelect = this.onPackageSizeSelect.bind(this);
  }

  async _loadPackageProfiles() {
    console.log("loading package profiles for store: ", this.props.user.storeId);
    const profiles = await this.props.loadPackageProfiles(this.props.user.storeId);
    console.log("PROFILES: ", profiles)
    if (!profiles) {
      this.setState({
        isLoading: false
      });
      return; 
    } else {
      this.setState({
        existingProfiles: profiles,
        isLoading: false
      });

    }
  }

  componentDidMount() {
    // load store information here 
    this.setState({
      isLoading: true
    }, async () => {
      // call to load store info
      await this._loadPackageProfiles();
    })
  }

  onPackageSizeSelect(key, values) {
    console.log("nselect values: ", values)
    if (values && values.length > 0) {
      const entry = values[0];
      let formData = this.state.formData;
      if (entry.id != 'custom-package-profile') {
        const sizing = entry.sizing;
        formData['lengthIn'] = sizing.length;
        formData['widthIn'] = sizing.width;
        formData['heightIn'] = sizing.height;
        formData['packageProfileName'] = entry.name;
      }
      formData[key] = entry;
      this.setState({
        formData
      });
    }
  }

  onChangeBaseInput(key, value) {
    let newFormData = {...this.state.formData};
    newFormData[key] = value;
    this.setState({
      formData: newFormData
    });
  }

  async addPackageProfile() {
    console.log(this.state)
    const formData = this.state.formData;
    const input = {
      width: formData.widthIn,
      height: formData.heightIn,
      length: formData.lengthIn,
      name: formData.packageProfileName,
      packageType: formData.packageSize.id,
      storeId: this.props.user.storeId
    }
    const newProfile = await this.props.createPackageProfile(input);
    let existingProfiles = this.state.existingProfiles;
    existingProfiles.push(newProfile);
    this.setState({
      existingProfiles: existingProfiles
    });
  }

  async onRemoveProfile(packageProfileId) {
    const deletedPackage = await this.props.deletePackageProfile(packageProfileId);
    let existingProfiles = this.state.existingProfiles;
    const newProfiles = existingProfiles.filter((profile) => {return profile._id != deletedPackage._id});
    this.setState({
      existingProfiles: newProfiles
    });
  }

  async onUpdateProfile(packageProfileId, fields) {
    console.log("Saving edits...", this.state.edits)
    const updatedPackage = await this.props.updatePackageProfile(packageProfileId, fields);
    let existingProfiles = this.state.existingProfiles;
    const newProfiles = existingProfiles.map((profile) => {
      return profile._id == updatedPackage._id ? updatedPackage : profile;
    });
    this.setState({
      existingProfiles: newProfiles
    })
  }

  onChangeEdit(packageProfileId, key, value)  {
    let edits = this.stat.edits;
    if (edits[packageProfileId]) {
      let packageProfileEdit = edits[packageProfileId];
      packageProfileEdit[key] = value;
      edits[packageProfileId] = packageProfileEdit;
    } else {
      edits[packageProfileId] = {
        [key]: value
      };
    }
    this.setState({
      edits
    });
  }

  renderExistingProfiles() {
    const existingProfiles = this.state.existingProfiles;
    if (!existingProfiles) {
      return null;
    }
    let profileViews = [];
    existingProfiles.map((profile) => {
      let view = (
        <div>
          <div>{profile.title}</div>
          <div>{profile.length}</div>
          <div>{profile.width}</div>
          <div>{profile.height}</div>
          <div> Click to edit each field to save </div>
        </div>);
      profileViews.push(
        view
      );
    });
    return profileViews;
  }

  renderAddNewProfile() {
    return (
      <div>
        <div> Add a new package size </div>
        <div style={{
            display: 'flex',
            paddingLeft: 16,
            paddingRight: 16, 
            paddingTop: 8,
            paddingBottom: 8,
            borderRadius: 8,
            backgroundColor: BrandStyles.color.xlightBeige}}>
          <NSelect 
            items={PACKAGE_PROFILES}
            itemIdKey="id"
            isSingleSelect={true}
            values={this.state.formData.packageType}
            title="Package Size"
            itemTitleKey="name"
            placeholderText={'Select package size...'}
            error={this.state.errors['packageSize']}
            onChangeItems={(values) => {
              this.onPackageSizeSelect('packageSize', values)
            }}/> 
          <BaseInput
            onChange={this.onChangeBaseInput}
            keyId="packageProfileName"
            label="Package Profile Name"
            placeholder="Enter profile name"
            value={this.state.formData.packageProfileName ? this.state.formData.packageProfileName: null}
            error={this.state.errors['packageProfileName']} />
          <BaseInput
            onChange={this.onChangeBaseInput}
            keyId="lengthIn"
            validate={isNumberValid}
            label="Length (In)"
            placeholder="(In)"
            widthFactor={6}
            value={this.state.formData.lengthIn ? this.state.formData.lengthIn : null}
            error={this.state.errors['lengthIn']} />
          <BaseInput
            onChange={this.onChangeBaseInput}
            keyId="widthIn"
            validate={isNumberValid}
            label="Width (In)"
            value={this.state.formData.widthIn ? this.state.formData.widthIn : null}
            error={this.state.errors['widthIn']} />
          <BaseInput
            onChange={this.onChangeBaseInput}
            keyId="heightIn"
            validate={isNumberValid}
            label="Height (In)"
            value={this.state.formData.heightIn ? this.state.formData.heightIn : null}
            error={this.state.errors['heightIn']} />
          <NButton title="Add Package Profile" onClick={this.addPackageProfile} />
        </div>
      </div>
      )
  }

  render() {
    if (this.state.isLoading) {
      return (
        <SellerDashboardNavWrapper>
          <div> Pulling up your store info </div>
        </SellerDashboardNavWrapper>);
    }
    return (
      <SellerDashboardNavWrapper>
        <div>
          <h3> Package Profiles </h3>
          <p> Add your most commonly used package sizes and we'll automatically calculate which
          package you should use for a particular order. For each product, you specify it's total packed height, width, and length. If
          a customer orders multiple items, we will calculat the total height, width, and length and automatically select
          the package that you should ship for.</p>
          <div>
            <div>{this.renderExistingProfiles()}</div>
            <div>{this.renderAddNewProfile()}</div>
          </div>
        </div>
      </SellerDashboardNavWrapper>
      );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth,
    store: state.store
  }
}
export default connect(mapStateToProps, {createPackageProfile, loadPackageProfiles, deletePackageProfile, updatePackageProfile})(SellerDashboardShippingPage);
