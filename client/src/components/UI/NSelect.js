import React, { Component } from 'react';
import BrandStyles from '../BrandStyles';
import { FaRegCheckCircle, FaChevronDown } from 'react-icons/fa';
import { GrFormClose } from 'react-icons/gr';
import Modal from 'react-modal';
import NButton from './NButton';
import FlatList from './FlatList';
import styled from 'styled-components';

const StyledInput = styled.div`
  height: 40px
  display: flex,
  justify-content: center,
  padding-left: 4px,
  padding-right: 16px,
  &:focus {
    outline: none
  } 
`
const StyledNSelectItemWrapper = styled.div`
  height: 40px;
  display: 'flex';
  justify-content: 'center';
  padding-left: 16;
  padding-bottom: 16;
  padding-top: 16;
  padding-right: 16;
  align-items: 'center';
  &:hover {
    cursor: pointer;
  }
`;

class NSelectItem extends React.PureComponent {
  render() {
    let isActive = this.props.isActive ? (
      <div style={itemStyles.activeItemIcon}>
        <FaRegCheckCircle style={BrandStyles.components.iconBlue} />
      </div>
    ) : (
      <div style={itemStyles.defaultWidth} />
    );
    let textActiveStyle = this.props.isActive ? styles.activeItem : styles.item;
    textActiveStyle = {...textActiveStyle, alignSelf: 'center'};
    return (
      <StyledNSelectItemWrapper
        underlayColor={BrandStyles.color.darkBeige}
        onClick={this.props.onClick}
        disabled={!this.props.canSelectMore}
        key={this.props.item[this.props.itemIdKey]}
      >
        <div style={itemStyles.contentContainer}>
          {isActive}
          <span style={textActiveStyle}>
            {this.props.item[this.props.itemTitleKey]}
          </span>
        </div>
      </StyledNSelectItemWrapper>
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
      <div style={selectedItemStyles.container}>
        <span>{this.props.item[this.props.itemTitleKey]}</span>
        <div
          style={selectedItemStyles.iconContainer}
          onClick={this.props.onClickDeleteItem}
        >
          <GrFormClose style={BrandStyles.components.icon} />
        </div>
      </div>
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
    console.log("ITEMS IN NSELECT", props.items)
    let items = props.items ? props.items : [];
    let newItems = props.newItems ? props.newItems : [];
    let inputValues = [];
    if (props.values) {
      inputValues = props.values;
    }
    this.state = {
      selectedItems: inputValues,
      isModalVisible: false,
      canSelectMore: true,
      data: items.concat(newItems),
      newItems: newItems,
    };
    console.log(this.state.data)
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
    let idKey = this.props.itemIdKey;
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
    let selectedItems = this.state.selectedItems;
    let alreadyExists = false;
    for (var idx in this.state.selectedItems) {
      let selectedItem = this.state.selectedItems[idx];
      // Item is already selected, so we remove it
      if (item[idKey] == selectedItem[idKey]) {
        selectedItems.splice(idx, 1);
        alreadyExists = true;
      }
    }

    for (var idx in newlyCreatedItems) {
      let createdItem = newlyCreatedItems[idx];
      if (item[idKey] == createdItem[idKey]) {
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
    let selectedItems = this.state.selectedItems;
    let isActive = false;
    for (var idx in selectedItems) {
      let sItem = selectedItems[idx];
      if (sItem[this.props.itemIdKey] === item[this.props.itemIdKey]) {
        isActive = true;
      }
    }
    let onItemPress = this.onItemPress.bind(this, item);

    return (
      <NSelectItem
        style={styles.item}
        onClick={onItemPress}
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
    let selectedItems = this.state.selectedItems;
    let selectedItemComps = [];
    for (var idx in selectedItems) {
      let sItem = selectedItems[idx];
      selectedItemComps.push(
        <NSelectedItem
          item={sItem}
          onClickDeleteItem={this.onItemPress.bind(this, sItem)}
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
      let textStyle = BrandStyles.components.placeholderText;
      textStyle = {...textStyle, color: BrandStyles.color.black,  fontWeight: 'bold'};
    if (this.state.selectedItems.length == 1 && this.props.hideSelectedTags) {
      let item = this.state.selectedItems[0];
      return (
        <span style={textStyle}>
          {item[this.props.itemTitleKey]}
        </span>
      );
    } else if (this.state.selectedItems.length > 1) {
      return (
        <span style={textStyle}>
          {this.props.placeholderText + `(${this.state.selectedItems.length} selected)`}
        </span>
      );
    } else {
      return (
        <span style={BrandStyles.components.placeholderText}> {this.props.placeholderText} </span>
      );
    }
  }

  _handleSearch(e) {
    let query = e.target.value;
    const formattedQuery = query.toLowerCase();
    // when to merge props with filteredData
    let filteredData = this.props.items.filter((item) => {
      let itemTitle = item[this.props.itemTitleKey].toLowerCase();
      return itemTitle.includes(query);
    });

    // if filtered Data is empty, add ability to create a new item
    if (filteredData.length == 0) {
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
      <div>
        <input
          autoCapitalize="none"
          autoCorrect={false}
          onChange={this._handleSearch.bind(this)}
          placeholder="Search"
        />
      </div>
    );
  }

  render() {
    console.log("Nselect", this.state.data)
    let extraHeaderStyle = {};
    let selectedItemsStyle = styles.selectedItemsContainer;
    let selectedTagsComp = null;
    let searchEnabled = this.props.searchEnabled ? this.props.searchEnabled : false;
    if (this.state.selectedItems.length > 0 && !this.props.hideSelectedTags) {
      extraHeaderStyle = styles.extraHeaderStyle;
    } else {
      selectedItemsStyle = styles.selectedItemsContainerEmpty;
    }
    if (!this.props.hideSelectedTags) {
      selectedTagsComp = <div style={selectedItemsStyle}>{this._renderSelectedItems()}</div>;
    }
    let headerStyle = this.props.error ? styles.errorContainer : styles.headerContainer;
    let labelStyle = this.props.error
      ? BrandStyles.components.inputBase.errorLabel
      : BrandStyles.components.inputBase.label;
    labelStyle = {...labelStyle, marginLeft: 16};
    let modalDiv = {...headerStyle, ...extraHeaderStyle, marginRight: 16, marginLeft: 16, flexDirection: 'column'};
    return (
      <div>
        <div
          style={modalDiv}
          onClick={this._showModal}
        >
          <span style={labelStyle}> {this.props.title} </span>
          <div style={styles.headerContentContainer}>
            {this._renderPlaceholderText()}
            <FaChevronDown style={BrandStyles.components.iconPlaceholder}/>
          </div>
        </div>
        <span style={labelStyle}>{this.props.error}</span>
        <Modal
          style={{content: {borderRadius: 32, backgroundColor: BrandStyles.color.lightBeige}}}
          animationType="slide"
          isOpen={this.state.isModalVisible}
          presentationStyle="fullScreen"
        >
          <div
            style={{
              backgroundColor: BrandStyles.color.lightBeige,
              height: '100vh',
              overflow: 'scroll'
            }}
          >
            <div onClick={this._closeModal}>
              <GrFormClose style={{'width': 30}} />
            </div>
            <span style={styles.headerTitle}>{this.props.placeholderText}</span>
            <FlatList
              style={styles.list}
              ListHeaderComponent={searchEnabled ? this._renderListHeader : () => {return (<div />);}}
              keyExtractor={(item) => item[this.props.itemIdKey]}
              initialNumToRender={10}
              ItemSeparatorComponent={() => <div style={styles.itemSeparator} />}
              extraData={this.state}
              data={this.state.data}
              renderItem={this._renderItem}
            />
          </div>
        </Modal>
        {selectedTagsComp}
      </div>
    );
  }
}

const itemStyles = {
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
    height: 40
  },
  activeItemIcon: {
    width: 32,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  defaultWidth: {
    width: 32,
  },
};

const selectedItemStyles = {
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderRadius: 16,
    border: `2px solid ${BrandStyles.color.black}`,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  iconContainer: {
    paddingLeft: 8,
  },
};

const styles = {
  modalContainer: {
    height: '100vh', 
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
    marginTop: -24,
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
    'border-bottom': `2px solid ${BrandStyles.color.maroon}`,
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
    'border-bottom': `2px solid ${BrandStyles.color.blue}`,
    borderBottomWidth: 2,
    backgroundColor: BrandStyles.color.warmlightBeige,
    paddingLeft: 16,
    paddingRight: 16,
  },
  headerContentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center'
  },
  list: {
    marginBottom: 84,
  },
  activeItem: {
    color: BrandStyles.color.blue,
    fontWeight: 'bold',
  },
  item: {
  },
};
