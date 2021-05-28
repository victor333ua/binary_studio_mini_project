import React, { useLayoutEffect, useState } from 'react';
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const PasswordInput = ({ className, eyeClassName, label, isDisabled, onChangePassword, onBlurPassword }) => {
  const [isShowPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const iconName = isShowPassword ? 'eye slash' : 'eye';
  const passwordType = isShowPassword ? 'text' : 'password';

  const changeVisibility = e => {
    setShowPassword(!isShowPassword);
    e.preventDefault();
  };

  useLayoutEffect(() => setPassword(''), [isDisabled]);

  return (
    <Form.Input
      className={`${styles.input} ${className}`}
      fluid
      label={label}
      icon="lock"
      iconPosition="left"
      placeholder="Password"
      type={passwordType}
      value={password}
      disabled={isDisabled}
      onChange={ev => { onChangePassword(ev.target.value); setPassword(ev.target.value); }}
      onBlur={onBlurPassword ? ev => onBlurPassword(ev.target.value) : null}
      action={{
        className: `${styles.eye} ${eyeClassName}`,
        icon: iconName,
        type: 'button',
        disabled: isDisabled,
        onClick: e => changeVisibility(e)
      }}
    />
  );
};
PasswordInput.propTypes = {
  onChangePassword: PropTypes.func.isRequired,
  onBlurPassword: PropTypes.func,
  label: PropTypes.string,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  eyeClassName: PropTypes.string
};
PasswordInput.defaultProps = {
  label: '',
  onBlurPassword: null,
  isDisabled: false,
  className: '',
  eyeClassName: ''
};
export default PasswordInput;
