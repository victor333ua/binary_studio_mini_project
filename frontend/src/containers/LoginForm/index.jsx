import React, { useState } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { Form, Button, Segment, Message } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../Profile/actions';

const LoginForm = ({
  login: logIn,
  status,
  error,
  location
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isShowPassword, setShowPassword] = useState(false);

  if (status === 'completed') { // или можно воспольз. isAuthorized
    const oldLocation = location.state?.from || { pathname: '/' };
    return <Redirect to={oldLocation} />;
    // в данном случае это не обязательно, т.к. PublicRoute
  }

  const iconName = isShowPassword ? 'eye slash' : 'eye';
  const passwordType = isShowPassword ? 'text' : 'password';

  const changeVisibility = e => {
    setShowPassword(!isShowPassword);
    e.preventDefault();
  };

  const emailChanged = data => {
    setEmail(data);
    setIsEmailValid(true);
  };

  const passwordChanged = data => {
    setPassword(data);
    setIsPasswordValid(true);
  };

  const handleLoginClick = () => {
    const isValid = isEmailValid && isPasswordValid;
    if (!isValid) return;

    logIn({ email, password });
    // error captured in action & changed the state
  };

  return (
    <Form name="loginForm" size="large" error={Boolean(error)} onSubmit={handleLoginClick}>
      <Segment>
        <Form.Input
          fluid
          icon="at"
          iconPosition="left"
          placeholder="Email"
          type="email"
          error={!isEmailValid}
          onChange={ev => emailChanged(ev.target.value)}
          onBlur={() => setIsEmailValid(validator.isEmail(email))}
        />
        <Message
          error
          header="Server error"
          content={error}
        />
        <Form.Input
          fluid
          placeholder="Password"
          type={passwordType}
          error={!isPasswordValid}
          onChange={ev => passwordChanged(ev.target.value)}
          onBlur={() => setIsPasswordValid(Boolean(password))}
          action={{ icon: iconName, type: 'button', onClick: e => changeVisibility(e) }}
        />
        <Button
          // onClick={handleLoginClick}
          type="submit"
          color="teal"
          fluid
          size="large"
          loading={status === 'loading'}
          primary
        >
          Login
        </Button>
      </Segment>
    </Form>
  );
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  error: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.objectOf(PropTypes.any).isRequired
};
LoginForm.defaultProps = {
  error: ''
};

const actions = { login };

const mapStateToProps = ({ profile }) => ({
  status: profile.status,
  error: profile.error
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);

