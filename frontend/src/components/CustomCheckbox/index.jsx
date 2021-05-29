import { Checkbox } from 'semantic-ui-react';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const CustomCheckbox = ({ label, checked, onChange }) => (
  <Checkbox
    className={styles.custom}
    toggle
    label={(
      <label>
        <span>{label}</span>
        <div style={{ height: '4rem' }}/>
      </label>
    )}
    checked={checked}
    onChange={onChange}
  />
);
CustomCheckbox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func
};
CustomCheckbox.defaultProps = {
  label: '',
  checked: false,
  onChange: null
};
export default CustomCheckbox;
