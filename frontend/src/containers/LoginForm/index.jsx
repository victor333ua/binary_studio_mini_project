import React, { useState } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { Form, Button, Segment, Message, Modal } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { profileResetError } from '../Profile/slice';
import { login } from '../Profile/asyncThunks';
import { resetPassword } from '../../services/authService';
import styles from './styles.module.scss';
import PasswordInput from '../../components/PasswordInput';

const LoginForm = ({
  login: logIn,
  profileResetError: resetErr,
  status,
  error,
  location
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [mailError, setMailError] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(true);

  if (status === 'completed') { // или можно воспольз. isAuthorized
    const oldLocation = location.state?.from || { pathname: '/' };
    return <Redirect to={oldLocation} />;
    // в данном случае это не обязательно, т.к. PublicRoute
  }

  const combinedError = error || mailError;

  const setNewData = setNewState => data => {
    setNewState(data);
    resetErr(); // set error to null in redux state to hide error message
  };

  const handleLoginClick = () => {
    if (!isEmailValid) return;
    logIn({ email, password });
    // error captured in action & changed the state
  };

  const reset = async () => {
    setMailError(null);
    try {
      await resetPassword(email);
    } catch (err) {
      setMailError(err);
    }
    setIsEmailSent(true);
  };

  return (
    <>
      <Modal
        dimmer="inverted"
        open={isEmailSent}
        onClose={() => setIsEmailSent(false)}
      >
        <Modal.Header>
          Request for reset password successfully done!
        </Modal.Header>
        <Modal.Content>
          Check your inbox in email server and follow further instructions
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={() => setIsEmailSent(false)}>
            Ok
          </Button>
        </Modal.Actions>
      </Modal>
      <Form name="loginForm" size="large" error={Boolean(combinedError)} onSubmit={handleLoginClick}>
        <Segment>
          <Message
            error
            header="Server error"
            content={combinedError}
          />
          <Form.Input
            fluid
            icon="at"
            iconPosition="left"
            placeholder="Email"
            type="email"
            error={!isEmailValid}
            onChange={ev => setNewData(setEmail)(ev.target.value)}
            onBlur={() => setIsEmailValid(validator.isEmail(email))}
          />
          <PasswordInput onChangePassword={setNewData(setPassword)} />
          <div>
            Forgot password?
            {' '}
            <span className={styles.reset} onClick={reset}>Reset</span>
          </div>
          <Button
            content="Login"
            type="submit"
            color="teal"
            fluid
            size="large"
            loading={status === 'loading'}
          />
        </Segment>
      </Form>
    </>
  );
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
  profileResetError: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  error: PropTypes.string,
  location: PropTypes.objectOf(PropTypes.any).isRequired
};
LoginForm.defaultProps = {
  error: null
};

const actions = { login, profileResetError };

const mapStateToProps = ({ profile }) => ({
  status: profile.status,
  error: profile.error
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);

