import React, { useState } from 'react';
import validator from 'validator';
import { Form, Button, Segment, Message, Modal } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { profileResetError } from '../Profile/slice';
import { login } from '../Profile/asyncThunks';
import { resetPassword } from '../../services/authService';
import styles from './styles.module.scss';
import PasswordInput from '../../components/PasswordInput';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [mailError, setMailError] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const status = useSelector(state => state.profile.status);
  const error = useSelector(state => state.profile.error);

  const dispatch = useDispatch();

  const combinedError = error || mailError;
  let headerError = 'Server Error';
  if (error) headerError = 'Invalid password/login';

  const setNewData = setNewState => data => {
    setNewState(data);
    dispatch(profileResetError()); // set error to null in redux state to hide error message
  };

  const handleLoginClick = () => {
    if (!isEmailValid) return;
    dispatch(login({ email, password }));
    // error captured in action & change the state
  };

  const reset = async () => {
    setMailError(null);
    try {
      await resetPassword(email);
      setIsEmailSent(true);
    } catch (err) {
      setMailError(err);
    }
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
            header={headerError}
            content={combinedError?.message}
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

export default LoginForm;

