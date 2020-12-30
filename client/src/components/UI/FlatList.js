import React from 'react';

export default class FlatList extends React.Component {
  renderList(data, ItemSeparatorComponent) {
    const items = [];
    data.forEach((item) => {
      items.push(
        <div key={this.props.keyExtractor(item)}>
          {this.props.renderItem({ item })}
          {ItemSeparatorComponent ? <ItemSeparatorComponent /> : null}
        </div>,
      );
    });
    return items;
  }

  render() {
    const { data, ListHeaderComponent, ItemSeparatorComponent } = this.props;
    return (
      <div style={this.props.style}>
        {ListHeaderComponent ? <ListHeaderComponent /> : null}
        {this.renderList(data, ItemSeparatorComponent)}
      </div>
    );
  }
}
