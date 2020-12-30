import React from 'react';
import { connect } from 'react-redux';

import NSelect from "components/UI/NSelect";
import NButton from 'components/UI/NButton';
import BrandStyles from "components/BrandStyles";
import EditableInput from "components/UI/EditableInput";
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
        edits: {}
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
        formData,
        isCreatingNewProfile: true
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
      existingProfiles,
      formData: {},
      isCreatingNewProfile: false
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

  async onUpdateProfile(packageProfileId) {
    const currEdits = this.state.edits;
    const packageProfileEdits = this.state.edits[packageProfileId];
    if (packageProfileEdits && packageProfileEdits.hasEdits) {
      const updatedPackage = await this.props.updatePackageProfile(packageProfileId, packageProfileEdits);
      const {existingProfiles} = this.state;
      const newProfiles = existingProfiles.map((profile) => (profile._id === updatedPackage._id) ? updatedPackage : profile);
      currEdits[packageProfileId] = {
        hasEdits: false
      };
      this.setState({
        existingProfiles: newProfiles,
        edits: currEdits
      })
    } else {
      // no edits
      this.setEditingState(packageProfileId, false);
    }
  }

  onChangeEditableInput(packageProfileId, key, value)  {
    const {edits} = this.state;
    if (edits[packageProfileId]) {
      const packageProfileEdit = edits[packageProfileId];
      packageProfileEdit[key] = value;
      edits[packageProfileId] = packageProfileEdit;
      edits[packageProfileId].hasEdits = true;
    } else {
      edits[packageProfileId] = {
        [key]: value,
        hasEdits: true
      };
    }
    this.setState({
      edits
    });
  }

  isEditing(packageProfileId) {
    const { edits } = this.state;
    return edits[packageProfileId] ? edits[packageProfileId].isEditing : false;
  }

  setEditingState(packageProfileId, value) {
    const { edits } = this.state;
    if (edits[packageProfileId]) {
      edits[packageProfileId].isEditing = value;
    } else {
      edits[packageProfileId] = {
        isEditing: value
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
      let { title, width, height, length} = profile;
      let titleError = null;
      let widthError = null;
      let heightError = null;
      let lengthError = null;
      if (this.state.edits[profile._id]) {
        const profileEdits = this.state.edits[profile._id];
        if (profileEdits.packageProfileName) {
          title = this.state.edits[profile._id].packageProfileName;
        }
        if (profileEdits.widthIn) {
          width = this.state.edits[profile._id].widthIn;
        }
        if (profileEdits.heightIn) {
          height = this.state.edits[profile._id].heightIn;
        }
        if (profileEdits.lengthIn) {
          length = this.state.edits[profile._id].lengthIn;
        }
      }
      if (this.state.errors.edits[profile._id]) {
        titleError = this.state.errors.edits[profile._id].packageProfileName;
        widthError = this.state.errors.edits[profile._id].widthIn;
        heightError = this.state.errors.edits[profile._id].heightIn;
        lengthError = this.state.errors.edits[profile._id].lengthIn;
      }
      const container = {
            borderBottomWidth: 2,
            borderBottomColor: BrandStyles.color.blue,
            borderBottomStyle: 'solid',
            paddingTop: 16, 
            paddingBottom: 16, 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            paddingLeft: 16,
      }
      const containerBackgroundColorStyle = this.isEditing(profile._id) ? { backgroundColor: 'aliceblue'} : {};
      const view = (
        <div style={{...container,...containerBackgroundColorStyle}}>
          <div>
              <EditableInput
                onChange={this.onChangeEditableInput.bind(this, profile._id)}
                onEditChange={this.setEditingState.bind(this, profile._id)}
                isEditing={this.isEditing(profile._id)}
                keyId="packageProfileName"
                label="Package Profile Name"
                placeholder="Enter profile name"
                maxWidth={200}
                value={title}
                error={titleError}/>
          </div>
          <div>
              <EditableInput
                onChange={this.onChangeEditableInput.bind(this, profile._id)}
                isEditing={this.isEditing(profile._id)}
                onEditChange={this.setEditingState.bind(this, profile._id)}
                keyId="lengthIn"
                label="Length (in)"
                placeholder="Enter length"
                maxWidth={100}
                value={length}
                error={lengthError}/>
          </div>
          <div>
              <EditableInput
                onChange={this.onChangeEditableInput.bind(this, profile._id)}
                onEditChange={this.setEditingState.bind(this, profile._id)}
                isEditing={this.isEditing(profile._id)}
                keyId="widthIn"
                label="Width (in)"
                placeholder="Enter width"
                maxWidth={100}
                value={width}
                error={widthError}/>
          </div>
          <div>
              <EditableInput
                onChange={this.onChangeEditableInput.bind(this, profile._id)}
                isEditing={this.isEditing(profile._id)}
                onEditChange={this.setEditingState.bind(this, profile._id)}
                keyId="heightIn"
                label="Height (in)"
                placeholder="Enter height"
                maxWidth={100}
                value={height}
                error={heightError}/>
          </div>
          <div>
            {this.isEditing(profile._id) 
                ? <NButton title="Save" size="x-small" onClick={this.onUpdateProfile.bind(this, profile._id)}/> 
                : <NButton theme="secondary" onClick={this.setEditingState.bind(this, profile._id, true)} title="Edit" size="x-small"/>}
          </div>
        </div>);
      profileViews.push(
        view
      );
      return profile;
    });
    return (
        <div style={BrandStyles.components.card.container}>
          <h4>Existing Package Profiles</h4>
          {profileViews} 
        </div>);
  }

  renderAddNewProfileInput() {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', flexDirection: 'row'}}>
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
        </div>
            <NButton title="Add Package Profile" onClick={this.addPackageProfile} />
      </div>
      )
  }

  renderAddNewProfile() {
    const profileInput = this.state.isCreatingNewProfile ? this.renderAddNewProfileInput() : null;
    return (
      <div style={{
            paddingLeft: 16,
            paddingRight: 16, 
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor: BrandStyles.color.xlightBeige, 
            borderRadius: 8}}>
        <h4> Add a new package size </h4>
        <div style={{
            display: 'flex',
            flexDirection: 'column'}}>
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
            <div>
              {profileInput}
            </div>
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
        <div style={{paddingRight: 32, paddingLef: 32}}>
          <h3> Package Profiles </h3>
          <p> Add your most commonly used package sizes and we'll automatically calculate which
          package you should use for a particular order. For each product, you specify it's total packed height, width, and length. If
          a customer orders multiple items, we will calculat the total height, width, and length and automatically select
          the package that you should ship for.</p>
          <div>
            <div>{this.renderAddNewProfile()}</div>
            <div>{this.renderExistingProfiles()}</div>
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
