import React, { Component } from 'react';

export default class FlatList extends React.Component {
  constructor(props)  {
    super(props);
  }

  renderList(data, ItemSeparatorComponent) {
    let items = [];
    data.map((item) =>{
      items.push(
        <div key={this.props.keyExtractor(item)}>
          {this.props.renderItem({item})}
          {ItemSeparatorComponent? <ItemSeparatorComponent />:null}
        </div>)
    });
    return items;
  }

  render() {
    let {data, initialNumToRender, keyExtractor, ListHeaderComponent, ItemSeparatorComponent, style, extraData, renderItem}  = this.props;
    return (
      <div style={this.props.style}>
        {ListHeaderComponent ? <ListHeaderComponent />: null}
        {this.renderList(data, ItemSeparatorComponent)}
      </div>
      );
  }
}