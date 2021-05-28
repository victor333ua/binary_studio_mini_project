import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import validator from 'validator';
import { Form, Button, Segment, Message, Modal } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login, resetError } from '../Profile/actions';
import { resetPassword } from '../../services/authService';
import styles from './styles.module.scss';
import PasswordInput from '../../components/PasswordInput';

const LoginForm = ({
  login: logIn,
  resetError: resetErr,
  status,
  error,
  location
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [mailError, setMailError] = useState(null);

  if (status === 'completed') { // или можно воспольз. isAuthorized
    const oldLocation = location.state?.from || { pathname: '/' };
    return <Redirect to={oldLocation} />;
    // в данном случае это не обязательно, т.к. PublicRoute
  }

  const combinedError = error || mailError;

  const setNewData = setNewState => data => {
    setNewState(data);
    resetErr();
  };

  const handleLoginClick = () => {
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
          <Form.Input
            fluid
            icon="at"
            iconPosition="left"
            placeholder="Email"
            type="email"
            onChange={ev => setNewData(setEmail)(ev.target.value)}
            // onBlur={() => setIsEmailValid(validator.isEmail(email))}
          />
          <Message
            error
            header="Server error"
            content={combinedError}
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
  resetError: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired
};

const actions = { login, resetError };

const mapStateToProps = ({ profile }) => ({
  status: profile.status,
  error: profile.error
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);

