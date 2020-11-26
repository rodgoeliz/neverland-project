import React, { useRef } from 'react';
import BrandStyles from '../BrandStyles';

const styles = {
  wrapper: {
    'flex-direction' : 'row',
    'margin-top' : 16,
    'margin-bottom' : 16,
  },
  container: {
    flex: 1,
    display: 'flex',
    'flex-direction' : 'row',
    'align-items' : 'center',
    'padding-left' : 16,
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  label: {
    'padding-left' : 8,
  },
};

export default class CheckBoxInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let error = this.props.error;
    if (error) {
      this.setState({
        error,
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.error != nextProps.error) {
      this.setState({ error: nextProps.error });
    }
  }

  render() {
    let showName = this.props.showName;
    let nameInput = null;
    let style = this.state.error ? BrandStyles.components.errorInput : BrandStyles.components.input;
    return (
      <div style={styles.container}>
        <input
          type="checkbox"
          style={styles.checkbox}
          checked={this.props.value}
          onChange={this.props.onValueChange}
        />
        <span style={styles.label}>{this.props.label}</span>
        <span>{this.props.error}</span>
      </div>
    );
  }
}
