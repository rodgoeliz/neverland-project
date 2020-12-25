import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';

import BrandStyles from '../../../BrandStyles';
import CheckBoxInput from '../../../UI/CheckBoxInput';
import BaseInput from '../../../UI/BaseInput';
import NSelect from '../../../UI/NSelect';
import NButton from '../../../UI/NButton';
import { GrFormClose } from 'react-icons/gr';

/**
 *
 * A view w/ a selector drop down
 *   - if I lcick on dropdown it opens up the modal with a selector and flat list
 *   - if items are selected, they should render selected in the modal
 *   - if none  are selected, if a person clicks on it, we show them as selected and render
 *   - when modal is closed, we render the multi select tags at the bottom
 */
class ProductVariantOptionTag extends React.PureComponent {
  render() {
    return (
      <div style={productVariantOptionStyles.container}>
        <span>{this.props.item[this.props.itemTitleKey]}</span>
        <div
          style={productVariantOptionStyles.iconContainer}
          onClick={this.props.onPressDeleteItem}
        >
          <GrFormClose style={BrandStyles.components.icon} />
        </div>
      </div>
    );
  }
}

{
  /*
 formData: {
  isPriceVaried
  isSkuVaried
  isQuantityVaried
  options: []
 }
*/
}

class AddProductVariationView extends Component {

  constructor(props) {
    super(props);
    const { variations } = props;
    this.state = {
      formData: {
        variations,
      },
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onRemoveVariationOption = this.onRemoveVariationOption.bind(this);
    this.onPressCreateNewVariant = this.onPressCreateNewVariant.bind(this);
    this.onPressCreateNewOption = this.onPressCreateNewOption.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.updateFormData = this.updateFormData.bind(this);
  }

  componentDidMount() {
    const { variations } = this.props;
    this.setState({
      formData: {
        variations,
      },
    });
  }

  updateFormData(formData) {
    this.setState(
      {
        formData,
      },
      () => {
      },
    );
  }

  onSubmit() {
    this.props.onSubmit(this.state.formData);
  }

  onCancel() {
    this.props.onCancel();
  }

  onRemoveVariationOption(variantSlug, optionHandle) {
    const newFormData = { ...this.state.formData };
    const variants = this.state.formData.variations;

    const updatedVariants = variants.map((variant) => {
      if (variantSlug === variant.handle) {
        const updatedOptions = variant.options.filter((option) => {
          return option.handle !== optionHandle;
        });
        variant.options = updatedOptions;
      }
      return variant;
    });

    newFormData.variations = updatedVariants;
    this.props.onChangeVariations(updatedVariants);
    this.updateFormData(newFormData);
  }

  renderVariationOption(option, variantSlug) {
    return (
      <ProductVariantOptionTag
        item={option}
        itemIdKey={'handle'}
        itemTitleKey={'title'}
        onPressDeleteItem={this.onRemoveVariationOption.bind(this, variantSlug, option.handle)}
      />
    );
  }

  onPressCreateNewVariant() {
    const newCustomVariantTitle = this.state.formData.createNewCustomVariation;
    const newCustomVariantHandle = newCustomVariantTitle
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
    const newCustomVariant = {
      title: newCustomVariantTitle,
      handle: newCustomVariantHandle,
      isPriceVaried: false,
      isSKUVaried: false,
      isQuantityVaried: false,
      isVisible: true,
    };
    const formDataCp = this.state.formData;
    if (formDataCp.variations) {
      formDataCp.variations.push(newCustomVariant);
    } else {
      formDataCp.variations = [newCustomVariant];
    }
    this.setState(
      {
        formData: formDataCp,
      },
      () => {
        this.props.onChangeVariations(this.state.formData.variations);
      },
    );
    // this.updateFormData(formDataCp)
  }

  onPressCreateNewOption(variationSlug) {
    let newOption = this.getOptionInput(variationSlug, 'createNewOption');
    let optionSlug = newOption
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
    let option = {
      title: newOption,
      handle: optionSlug,
    };
    let newFormData = { ...this.state.formData };
    let variations = newFormData.variations;
    let newVariations = variations.map((variation) => {
      if (variation.handle === variationSlug) {
        let existingOptions = variation.options;
        if (!existingOptions) {
          existingOptions = [];
        }
        existingOptions.push(option);
        variation.options = existingOptions;
      }
      return variation;
    });
    newFormData.variations = newVariations;
    //clear out new option
    newFormData.createNewOption = '';
    this.onChangeOptionInput(variationSlug, 'createNewOption', '');
    this.updateFormData(newFormData);
    this.props.onChangeVariations(newVariations);
  }

  onChangeInput(key, value) {
    const newFormData = { ...this.state.formData };
    newFormData[key] = value;
    this.updateFormData(newFormData);
  }

  toggleSelection(key, variationSlug) {
    const newFormData = { ...this.state.formData };
    const { variations } = newFormData;
    for (let i = 0; i < variations.length; i++) {
      const variation = variations[i];
      if (variation.handle === variationSlug) {
        variation[key] = !variation[key];
      }
    }
    newFormData.variations = variations;
    this.updateFormData(newFormData);
  }

  isChecked(key, variationSlug) {
    const { variations } = this.state.formData;
    for (let i = 0; i < variations.length; i++) {
      const variation = variations[i];
      if (variation.handle == variationSlug) {
        return variation[key];
      }
    }
    return false;
  }

  getOptionInput(variantSlug, key) {
    let optionInput = '';
    if (!this.state.formData.variations) {
      return '';
    }
    this.state.formData.variations.map((variant) => {
      if (variant.handle == variantSlug) {
        optionInput = variant[key];
      }
    });
    return optionInput;
  }

  onChangeOptionInput(variantSlug, key, newOptionValue) {
    const newFormData = { ...this.state.formData };
    const updatedVariants = newFormData.variations.map((variant) => {
      if (variant.handle === variantSlug) {
        variant[key] = newOptionValue;
      }
      return variant;
    });

    newFormData.variations = updatedVariants;
    this.updateFormData(newFormData);
  }

  onPressRemoveVariation(variationHandle) {
    const newFormData = { ...this.state.formData };
    let variations = newFormData.variations;
    if (variations) {
      for (const idx in variations) {
        let variation = variations[idx];
        if (variation.handle === variationHandle) {
          variations = variations.splice(idx, 1);
        }
      }

      newFormData.variation = variations;
      this.updateFormData(newFormData);
    }

    return;
  }

  renderProductVariations(variations) {
    if (!variations) {
      return [];
    }
    const variationViews = [];
    variations.map((variation) => {
      const optionsViews = [];
      let variationOptions = [];
      if (variation.options) {
        variationOptions = variation.options;
      }

      variationOptions.map((option) => {
        optionsViews.push(this.renderVariationOption(option, variation.handle));
      });
      variationViews.push(
        <div key={variation.hdnle} style={styles.sectionContainer}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
              {variation.title}
            </span>
            <div onClick={this.onPressRemoveVariation.bind(this, variation.handle)}>
              <GrFormClose style={BrandStyles.components.icon} />
            </div>
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginLeft: 12,
              marginBottom: 8,
            }}
          >
            Option Settings
          </span>
          <CheckBoxInput
            label={`Prices vary for each ${variation.title}`}
            value={this.isChecked('isPriceVaried', variation.handle)}
            onValueChange={this.toggleSelection.bind(this, 'isPriceVaried', variation.handle)}
          />
          <div style={{ height: 8 }} />
          <CheckBoxInput
            label={`SKUs vary for each ${variation.title}`}
            value={this.isChecked('isSKUVaried', variation.handle)}
            onValueChange={this.toggleSelection.bind(this, 'isSKUVaried', variation.handle)}
          />
          <div style={{ height: 8 }} />
          <CheckBoxInput
            label={`Quantity vary for each ${variation.title}`}
            value={this.isChecked('isQuantityVaried', variation.handle)}
            onValueChange={this.toggleSelection.bind(this, 'isQuantityVaried', variation.handle)}
          />
          <div
            style={{
              marginTop: 16,
              marginRight: 16,
              marginLeft: 8,
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
              {' '}
              Add a new option{' '}
            </span>
            <BaseInput
              full={true}
              keyId="createNewOption"
              autoCapitalize="words"
              widthFactor={1}
              label={`New option for ${variation.title}`}
              onChange={this.onChangeOptionInput.bind(this, variation.handle)}
              value={this.getOptionInput(variation.handle, 'createNewOption')}
            />
            <NButton
              onClick={() => this.onPressCreateNewOption(variation.handle)}
              title={`Create a new option for ${variation.title}`}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
            {optionsViews}
          </div>
        </div>,
      );
    });
    return variationViews;
  }

  createNewVariation(title, handle) {
    let newCustomVariantTitle = title;
    let newCustomVariantHandle = handle;
    let newCustomVariant = {
      title: newCustomVariantTitle,
      handle: newCustomVariantHandle,
      isPriceVaried: false,
      isSKUVaried: false,
      isQuantityVaried: false,
      isVisible: true,
    };
    let formDataCp = this.state.formData;
    if (formDataCp.variations) {
      formDataCp.variations.push(newCustomVariant);
    } else {
      formDataCp.variations = [newCustomVariant];
    }
    this.setState(
      {
        formData: formDataCp,
      },
      () => {
        this.props.onChangeVariations(formDataCp.variations);
      },
    );
  }

  onChangeNSelectInput(key, itemIdKey, values) {
    if (values && values.length > 0) {
      let value = values[0][itemIdKey];
      return this.onChangePickerInput(key, value);
    }
  }

  onChangePickerInput(key, value) {
    const newFormData = { ...this.state.formData };
    newFormData[key] = value;
    let title = value.charAt(0).toUpperCase() + value.slice(1);
    if (value === 'size' || value === 'color') {
      return this.createNewVariation(title, value);
    }
    return this.updateFormData(newFormData);
  }

  renderCreateNewProductVariationPicker() {
    const displayCreateCustomVariationView =
      this.state.formData.createNewVariation == 'create-new-variant';
    let createCustomVariationInputView = null;
    if (displayCreateCustomVariationView) {
      createCustomVariationInputView = (
        <div>
          <BaseInput
            onChange={this.onChangeInput}
            keyId="createNewCustomVariation"
            label="Create a new product variant"
            error={this.state.shopHandleError}
          />
          <NButton title="Add a new variant" onClick={this.onPressCreateNewVariant.bind(this)} />
        </div>
      );
    }

    let addProductVariationView = (
      <NSelect
        items={[
          { id: 'color', value: 'Color' },
          { id: 'size', value: 'Size' },
          { id: 'create-new-variant', value: 'Create a new variant' },
        ]}
        title="Add a product variation"
        isSingleSelect={true}
        itemIdKey="id"
        itemTitleKey="value"
        hideSelectedTags={true}
        placeholderText={'Select product variation...'}
        onChangeItems={this.onChangeNSelectInput.bind(this, 'createNewVariation', 'id')}
      />
    );
    return (
      <div>
        {addProductVariationView}
        {createCustomVariationInputView}
      </div>
    );
    {/*
    return (
      {/*<div>
        <div>
          <NSelect
            items={[

              ]}
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            style={{ width: undefined }}
            placeholder="Add a variation"
            placeholderStyle={{ color: '#bfc6ea' }}
            placeholderIconColor="#007aff"
            selectedValue={this.state.formData.createNewVariation}
            onValueChange={(value) => {
              this.onChangePickerInput('createNewVariation', value);
            }}
          >
            <Picker.Item label="Color" value="color" />
            <Picker.Item label="Size" value="size" />
            <Picker.Item label="Create a new variant" value="create-new-variant" />
          </Picker>
        </div>
        {createCustomVariationInputView}
      </div>
    );*/}
  }

  render() {
    let { variations, isSavingProduct } = this.props;
    let existingVariationViews = null;
    if (variations && variations.length > 0) {
      existingVariationViews = (
        <div style={{ paddingTop: 16 }}>
          <span style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
            Your Product Variations
          </span>
          {this.renderProductVariations(variations)}
        </div>
      );
    }
    return (
      <div style={{ flex: 1 }}>
        <div
          style={{
            backgroundColor: BrandStyles.color.lightBeige,
            height:'100vh',
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                minHeight: 48,
              }}
            >
              <NButton title="Close" theme="secondary" onClick={this.props.onCloseModal} />
              <NButton title="Save" onClick={this.props.onCloseModal} />
            </div>
            <div
              enableResetScrollToCoords={false}
              keyboardShouldPersistTaps="handled"
              style={{
                paddingBottom: 64,
                maxHeight: '100vh - 128px', 
              }}
            >
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 6,
                }}
              >
                Product Variations
              </span>
              <span style={{ marginLeft: 12, marginBottom: 8 }}>
                You can have maximum 2 variations{' '}
              </span>
            </div>
              {this.renderCreateNewProductVariationPicker()}
              {existingVariationViews}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const productVariantOptionStyles = {
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 2,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    borderColor: BrandStyles.color.black,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
  },
  iconContainer: {
    paddingLeft: 8,
  },
};

const styles = {
  sectionContainer: {
    margin: 16,
    marginBottom: 16,
    marginTop: 16,
    backgroundColor: BrandStyles.color.xlightBeige,
    padding: 16,
    borderRadius: 16,
    shadowColor: 'rgba(0,0,0, 0.2)',
    shadowOffset: { height: 4, width: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
};
export default AddProductVariationView;
