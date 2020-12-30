import React from 'react';

const styles = {
  wrapper: {
    'flex-direction': 'row',
    'margin-top': 16,
    'margin-bottom': 16,
  },
  container: {
    flex: 1,
    display: 'flex',
    'flex-direction': 'row',
    'align-items': 'center',
    'padding-left': 16,
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  label: {
    'padding-left': 8,
  },
};

export default function CheckBoxInput({ error, label, value, onValueChange }) {
  return (
    <div style={styles.container}>
      <input type="checkbox" style={styles.checkbox} checked={value} onChange={onValueChange} />
      <span style={styles.label}>{label}</span>
      <span>{error}</span>
    </div>
  );
}
