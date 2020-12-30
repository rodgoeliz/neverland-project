/* eslint-disable */
import React, { Component } from 'react';

import BrandStyles from 'components/BrandStyles';

const itemStyles = StyleSheet.create({
  wrapperContainer: {
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  activeItemIcon: {
    width: 32,
    display: 'flex',
    justifyContent: 'center',
  },
  defaultWidth: {
    width: 32,
  },
});

const selectedItemStyles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
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
});

const styles = StyleSheet.create({
  modalContainer: {
    height: Dimensions.get('window').height,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingLeft: 16,
    paddingBottom: 16,
  },
  extraHeaderStyle: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  closeIcon: {
    paddingRight: 16,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 24,
    alignSelf: 'flex-end',
  },
  itemSeparator: {
    height: 1,
    backgroundColor: BrandStyles.color.beige,
  },
  selectedItemsContainerEmpty: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  selectedItemsContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: BrandStyles.color.warmlightBeige,
    marginTop: -16,
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  errorContainer: {
    minHeight: 50,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderColor: BrandStyles.color.maroon,
    borderBottomWidth: 2,
    backgroundColor: BrandStyles.color.warmlightBeige,
    paddingLeft: 16,
    paddingRight: 16,
  },
  headerContainer: {
    minHeight: 50,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderColor: BrandStyles.color.blue,
    borderBottomWidth: 2,
    backgroundColor: BrandStyles.color.warmlightBeige,
    paddingLeft: 16,
    paddingRight: 16,
  },
  headerContentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list: {
    marginBottom: 84,
  },
  activeItem: {
    color: BrandStyles.color.blue,
    fontWeight: 'bold',
  },
  item: {},
});

class NSelectItem extends React.PureComponent {
  render() {
    const isActive = this.props.isActive ? (
      <View style={itemStyles.activeItemIcon}>
        <Icon type="FontAwesome" name="check-circle-o" style={BrandStyles.components.iconBlue} />
      </View>
    ) : (
      <View style={itemStyles.defaultWidth} />
    );
    const textActiveStyle = this.props.isActive ? styles.activeItem : styles.item;
    return (
      <TouchableHighlight
        style={itemStyles.wrapperContainer}
        underlayColor={BrandStyles.color.darkBeige}
        onPress={this.props.onPress}
        disabled={!this.props.canSelectMore}
        key={this.props.item[this.props.itemIdKey]}
      >
        <View style={itemStyles.contentContainer}>
          {isActive}
          <Text style={(textActiveStyle, { alignSelf: 'center' })}>{this.props.item[this.props.itemTitleKey]}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

/**
 *
 * A view w/ a selector drop down
 *   - if I lcick on dropdown it opens up the modal with a selector and flat list
 *   - if items are selected, they should render selected in the modal
 *   - if none  are selected, if a person clicks on it, we show them as selected and render
 *   - when modal is closed, we render the multi select tags at the bottom
 */
class NSelectedItem extends React.PureComponent {
  render() {
    return (
      <View style={selectedItemStyles.container}>
        <Text>{this.props.item[this.props.itemTitleKey]}</Text>
        <TouchableOpacity style={selectedItemStyles.iconContainer} onPress={this.props.onPressDeleteItem}>
          <Icon type="FontAwesome" name="close" style={BrandStyles.components.icon} />
        </TouchableOpacity>
      </View>
    );
  }
}

/**
 * item:
 * {
 *   id: "",
 *   title: "Display title"
 * }
 * itemIdKey: String
 * itemTitleKey: String
 * items: []
 * onPressItem: Function
 * hideSelectedTags: Boolean
 * onChangeItems: // returns selected items
 */
export default class NSelect extends Component {
  constructor(props) {
    super(props);
    const items = props.items ? props.items : [];
    const newItems = props.newItems ? props.newItems : [];
    let inputValues = [];
    if (props.values) {
      inputValues = props.values;
    }
    this.state = {
      selectedItems: inputValues,
      isModalVisible: false,
      canSelectMore: true,
      data: items.concat(newItems),
      newItems,
    };
    this._renderItem = this._renderItem.bind(this);
    this._renderListHeader = this._renderListHeader.bind(this);
    this._showModal = this._showModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this._onChangeItems = this._onChangeItems.bind(this);
  }

  _onChangeItems() {
    this.props.onChangeItems(this.state.selectedItems);
    if (this.state.newItems.length > 0 && this.props.onChangeNewItems) {
      this.props.onChangeNewItems(this.state.newItems);
    }
  }

  onItemPress(item) {
    const idKey = this.props.itemIdKey;
    let newlyCreatedItems = this.state.newItems;
    // add items to selected Items
    if (this.props.isSingleSelect) {
      if (item[idKey].includes('add-new')) {
        newlyCreatedItems = [item];
      }
      this.setState(
        {
          newItems: newlyCreatedItems,
          selectedItems: [item],
          data: newlyCreatedItems.concat(this.props.items),
        },
        () => {
          this._onChangeItems();
          this._closeModal();
        },
      );
      return;
    }
    const { selectedItems } = this.state;
    let alreadyExists = false;
    for (var idx in this.state.selectedItems) {
      const selectedItem = this.state.selectedItems[idx];
      // Item is already selected, so we remove it
      if (item[idKey] === selectedItem[idKey]) {
        selectedItems.splice(idx, 1);
        alreadyExists = true;
      }
    }

    for (var idx in newlyCreatedItems) {
      const createdItem = newlyCreatedItems[idx];
      if (item[idKey] === createdItem[idKey]) {
        newlyCreatedItems.splice(idx, 1);
        alreadyExists = true;
      }
    }

    if (!alreadyExists) {
      selectedItems.push(item);
    }
    if (!alreadyExists && item[idKey].includes('add-new')) {
      newlyCreatedItems.push(item);
    }
    this.setState(
      {
        newItems: newlyCreatedItems,
        selectedItems,
        data: newlyCreatedItems.concat(this.props.items),
      },
      () => {
        this._onChangeItems();
      },
    );
  }

  _renderItem({ item }) {
    const { selectedItems } = this.state;
    let isActive = false;
    for (const idx in selectedItems) {
      const sItem = selectedItems[idx];
      if (sItem[this.props.itemIdKey] === item[this.props.itemIdKey]) {
        isActive = true;
      }
    }
    const onItemPress = this.onItemPress.bind(this, item);

    return (
      <NSelectItem
        style={styles.item}
        onPress={onItemPress}
        itemIdKey={this.props.itemIdKey}
        itemTitleKey={this.props.itemTitleKey}
        isActive={isActive}
        canSelectMore={this.state.canSelectMore}
        item={item}
        key={this.props.itemIdKey}
        title={this.props.itemTitleKey}
      />
    );
  }

  _renderSelectedItems() {
    const { selectedItems } = this.state;
    const selectedItemComps = [];
    for (const idx in selectedItems) {
      const sItem = selectedItems[idx];
      selectedItemComps.push(
        <NSelectedItem
          item={sItem}
          onPressDeleteItem={this.onItemPress.bind(this, sItem)}
          itemIdKey={this.props.itemIdKey}
          itemTitleKey={this.props.itemTitleKey}
        />,
      );
    }
    return selectedItemComps;
  }

  _showModal() {
    this.setState({
      isModalVisible: true,
    });
  }

  _closeModal() {
    this.setState({
      isModalVisible: false,
    });
  }

  _renderPlaceholderText() {
    if (this.state.selectedItems.length === 1 && this.props.hideSelectedTags) {
      const item = this.state.selectedItems[0];
      return (
        <Text style={[BrandStyles.components.placeholderText, { color: BrandStyles.color.black, fontWeight: 'bold' }]}>
          {item[this.props.itemTitleKey]}
        </Text>
      );
    }
    if (this.state.selectedItems.length > 1) {
      return (
        <Text style={[BrandStyles.components.placeholderText, { color: BrandStyles.color.black, fontWeight: 'bold' }]}>
          {`${this.props.placeholderText}(${this.state.selectedItems.length} selected)`}
        </Text>
      );
    }
    return <Text style={BrandStyles.components.placeholderText}> {this.props.placeholderText}</Text>;
  }

  _handleSearch(query) {
    const formattedQuery = query.toLowerCase();
    // when to merge props with filteredData
    const filteredData = this.props.items.filter((item) => {
      const itemTitle = item[this.props.itemTitleKey].toLowerCase();
      return itemTitle.includes(query);
    });

    // if filtered Data is empty, add ability to create a new item
    if (filteredData.length === 0) {
      filteredData.push({
        [this.props.itemIdKey]: `add-new:${query}`,
        [this.props.itemTitleKey]: `Add a new item: ${query}`,
      });
    }
    this.setState({
      data: filteredData,
      query,
    });
  }

  _renderListHeader() {
    return (
      <View>
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={this._handleSearch.bind(this)}
          placeholder="Search"
        />
      </View>
    );
  }

  render() {
    return <div>Nselect render</div>;
    let extraHeaderStyle = {};
    let selectedItemsStyle = styles.selectedItemsContainer;
    let selectedTagsComp = null;
    const searchEnabled = this.props.searchEnabled ? this.props.searchEnabled : false;
    if (this.state.selectedItems.length > 0 && !this.props.hideSelectedTags) {
      extraHeaderStyle = styles.extraHeaderStyle;
    } else {
      selectedItemsStyle = styles.selectedItemsContainerEmpty;
    }
    if (!this.props.hideSelectedTags) {
      selectedTagsComp = <View style={selectedItemsStyle}>{this._renderSelectedItems()}</View>;
    }
    const headerStyle = this.props.error ? styles.errorContainer : styles.headerContainer;
    const labelStyle = this.props.error
      ? BrandStyles.components.inputBase.errorLabel
      : BrandStyles.components.inputBase.label;
    return (
      <SafeAreaView>
        <TouchableOpacity
          style={[headerStyle, extraHeaderStyle, { marginRight: 16, marginLeft: 16 }]}
          onPress={this._showModal}
        >
          <Text style={labelStyle}> {this.props.title} </Text>
          <View style={styles.headerContentContainer}>
            {this._renderPlaceholderText()}
            <Icon type="FontAwesome" name="chevron-down" style={BrandStyles.components.iconPlaceholder} />
          </View>
        </TouchableOpacity>
        <Text style={[labelStyle, { marginLeft: 16 }]}>{this.props.error}</Text>
        <Modal animationType="slide" visible={this.state.isModalVisible} presentationStyle="fullScreen">
          <SafeAreaView
            style={{
              backgroundColor: BrandStyles.color.lightBeige,
              height: Dimensions.get('window').height,
            }}
          >
            <TouchableOpacity onPress={this._closeModal}>
              <Icon type="FontAwesome" name="close" style={styles.closeIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{this.props.placeholderText}</Text>
            <FlatList
              style={styles.list}
              ListHeaderComponent={searchEnabled ? this._renderListHeader : <View />}
              keyExtractor={(item) => item[this.props.itemIdKey]}
              initialNumToRender={10}
              ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
              extraData={this.state}
              data={this.state.data}
              renderItem={this._renderItem}
            />
          </SafeAreaView>
        </Modal>
        {selectedTagsComp}
      </SafeAreaView>
    );
  }
}
