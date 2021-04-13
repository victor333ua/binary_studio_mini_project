import React, { useState } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { Form, Button, Segment } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Spinner from 'src/components/Spinner';
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

  if (status === 'loading') return <Spinner />;

  if (status === 'completed') {
    const from = location.state?.from || { pathname: '/' };
    return <Redirect to={from} />;
    // в данном случае это не обязательно, т.к. перерисовка главного экрана происходит
    // из-за обертки PublicRoute
  }

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
    // eslint-disable-next-line no-console
    // .catch(err => console.log(err));
  };

  return (
    <Form name="loginForm" size="large" onSubmit={handleLoginClick}>
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
        {status === 'error' && <div>{error}</div>}
        <Form.Input
          fluid
          icon="lock"
          iconPosition="left"
          placeholder="Password"
          type="password"
          error={!isPasswordValid}
          onChange={ev => passwordChanged(ev.target.value)}
          onBlur={() => setIsPasswordValid(Boolean(password))}
        />
        <Button type="submit" color="teal" fluid size="large" loading={status === 'loading'} primary>
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

