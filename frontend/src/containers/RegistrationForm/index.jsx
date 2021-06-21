import React, { useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Segment, Message } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import validator from 'validator';
import { register } from '../Profile/asyncThunks';
import PasswordInput from '../../components/PasswordInput';

const RegistrationForm = ({ register: signIn, status, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [registerError, setRegisterError] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const onRegister = async () => {
    if (!isEmailValid) return;
    await signIn({ email, password, username });
  };

  useLayoutEffect(() => {
    if (error) setRegisterError(true);
  }, [error]);

  const onEmail = data => {
    setRegisterError(false);
    setEmail(data);
  };

  return (
    <Form name="registrationForm" size="large" error={registerError} onSubmit={onRegister}>
      <Segment>
        <Message
          error
          header="Server error"
          content="User with such email already registered, please sign in"
        />
        <Form.Input
          fluid
          icon="user"
          iconPosition="left"
          placeholder="Username"
          type="text"
          onChange={ev => setUsername(ev.target.value)}
        />
        <Form.Input
          fluid
          icon="at"
          iconPosition="left"
          placeholder="Email"
          type="email"
          error={!isEmailValid}
          onChange={ev => onEmail(ev.target.value)}
          onBlur={() => setIsEmailValid(validator.isEmail(email))}
        />
        <PasswordInput onChangePassword={setPassword} />
        <Button type="submit" color="teal" fluid size="large" loading={status === 'loading'} >
          Register
        </Button>
      </Segment>
    </Form>
  );
};

RegistrationForm.propTypes = {
  register: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  error: PropTypes.string
};
RegistrationForm.defaultProps = {
  error: null
};
const actions = { register };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);
const mapStateToProps = ({ profile }) => ({
  status: profile.status,
  error: profile.error
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationForm);

