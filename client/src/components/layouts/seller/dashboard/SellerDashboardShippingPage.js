import React from 'react';
import { connect } from 'react-redux';

import NSelect from "components/UI/NSelect";
import NButton from 'components/UI/NButton';
import BrandStyles from "components/BrandStyles";
import BaseInput from "components/UI/BaseInput";

import { createPackageProfile, loadPackageProfiles, deletePackageProfile, updatePackageProfile } from 'actions/shipping';
import isNumberValid from "utils/numberValidator";
import PACKAGE_PROFILES from 'constants/packageProfiles';

import SellerDashboardNavWrapper from './SellerDashboardNavWrapper';

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
    const profiles = await this.props.loadPackageProfiles(this.props.user.storeId);
    if (!profiles) {
      this.setState({
        isLoading: false
      });
       
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
    if (values && values.length > 0) {
      const entry = values[0];
      const {formData} = this.state;
      if (entry.id !== 'custom-package-profile') {
        const {sizing} = entry;
        formData.lengthIn = sizing.length;
        formData.widthIn = sizing.width;
        formData.heightIn = sizing.height;
        formData.packageProfileName = entry.name;
      }
      formData[key] = entry;
      this.setState({
        formData
      });
    }
  }

  onChangeBaseInput(key, value) {
    const newFormData = {...this.state.formData};
    newFormData[key] = value;
    this.setState({
      formData: newFormData
    });
  }

  async addPackageProfile() {
    const {formData} = this.state;
    const input = {
      width: formData.widthIn,
      height: formData.heightIn,
      length: formData.lengthIn,
      name: formData.packageProfileName,
      packageType: formData.packageSize.id,
      storeId: this.props.user.storeId
    }
    const newProfile = await this.props.createPackageProfile(input);
    const {existingProfiles} = this.state;
    existingProfiles.push(newProfile);
    this.setState({
      existingProfiles
    });
  }

  async onRemoveProfile(packageProfileId) {
    const deletedPackage = await this.props.deletePackageProfile(packageProfileId);
    const {existingProfiles} = this.state;
    const newProfiles = existingProfiles.filter((profile) => profile._id !== deletedPackage._id);
    this.setState({
      existingProfiles: newProfiles
    });
  }

  async onUpdateProfile(packageProfileId, fields) {
    console.log("Saving edits...", this.state.edits)
    const updatedPackage = await this.props.updatePackageProfile(packageProfileId, fields);
    const {existingProfiles} = this.state;
    const newProfiles = existingProfiles.map((profile) => (profile._id === updatedPackage._id) ? updatedPackage : profile);
    this.setState({
      existingProfiles: newProfiles
    })
  }

  onChangeEdit(packageProfileId, key, value)  {
    const {edits} = this.stat;
    if (edits[packageProfileId]) {
      const packageProfileEdit = edits[packageProfileId];
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
    const {existingProfiles} = this.state;
    if (!existingProfiles) {
      return null;
    }
    const profileViews = [];
    existingProfiles.map((profile) => {
      const view = (
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
      return profile;
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
            isSingleSelect
            values={this.state.formData.packageType}
            title="Package Size"
            itemTitleKey="name"
            placeholderText="Select package size..."
            error={this.state.errors.packageSize}
            onChangeItems={(values) => {
              this.onPackageSizeSelect('packageSize', values)
            }}/> 
          <BaseInput
            onChange={this.onChangeBaseInput}
            keyId="packageProfileName"
            label="Package Profile Name"
            placeholder="Enter profile name"
            value={this.state.formData.packageProfileName ? this.state.formData.packageProfileName: null}
            error={this.state.errors.packageProfileName} />
          <BaseInput
            onChange={this.onChangeBaseInput}
            keyId="lengthIn"
            validate={isNumberValid}
            label="Length (In)"
            placeholder="(In)"
            widthFactor={6}
            value={this.state.formData.lengthIn ? this.state.formData.lengthIn : null}
            error={this.state.errors.lengthIn} />
          <BaseInput
            onChange={this.onChangeBaseInput}
            keyId="widthIn"
            validate={isNumberValid}
            label="Width (In)"
            value={this.state.formData.widthIn ? this.state.formData.widthIn : null}
            error={this.state.errors.widthIn} />
          <BaseInput
            onChange={this.onChangeBaseInput}
            keyId="heightIn"
            validate={isNumberValid}
            label="Height (In)"
            value={this.state.formData.heightIn ? this.state.formData.heightIn : null}
            error={this.state.errors.heightIn} />
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

const mapStateToProps = state => ({
    user: state.auth,
    store: state.store
  })
export default connect(mapStateToProps, {createPackageProfile, loadPackageProfiles, deletePackageProfile, updatePackageProfile})(SellerDashboardShippingPage);
