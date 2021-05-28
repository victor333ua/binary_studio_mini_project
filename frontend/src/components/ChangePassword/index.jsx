import React, { useState } from 'react';
import { Button, Form, Grid, Header, Message, Modal, Segment } from 'semantic-ui-react';
import Logo from 'src/components/Logo';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { changePassword } from '../../services/authService';
import PasswordInput from '../PasswordInput';

const ChangePassword = ({ match }) => {
  const { token } = match.params;

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isExit, setExit] = useState(false);
  const [errorMatching, setErrorMatching] = useState(false);
  const [errorChangePassword, setErrorChangePassword] = useState(false);

  const checkMatchPasswords = () => setIsPasswordValid(passwordConfirm === password);

  const setNewValue = setNewState => value => {
    setErrorMatching(false);
    setNewState(value);
  };

  const sendPassword = async () => {
    if (!isPasswordValid || password === '') {
      setErrorMatching(true);
      return;
    }
    setIsLoading(true);
    try {
      await changePassword(password, token);
    } catch (err) {
      setErrorChangePassword(true);
      return;
    } finally {
      setIsLoading(false);
    }
    setExit(true);
  };

  return (
    <>
      <Modal
        dimmer="blurring"
        open={errorChangePassword}
      >
        <Modal.Header>
          Token to change password has expired!
        </Modal.Header>
        <Modal.Content>
          Please resend email - click Reset link in Login Page once more!
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            content="Ok"
            onClick={() => {
              setErrorChangePassword(false);
              setExit(true);
            }}
          />
        </Modal.Actions>
      </Modal>
      <Grid textAlign="center" verticalAlign="middle" className="fill">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Logo />
          <Header as="h2" color="teal" textAlign="center">
            Reset Password
          </Header>
          <Form size="large" error={errorMatching} onSubmit={sendPassword}>
            <Segment>
              <PasswordInput
                label="New password"
                onChangePassword={setNewValue(setPassword)}
                onBlurPassword={checkMatchPasswords}
              />
              <Message
                error
                header="Error!"
                content="Passwords don't match"
              />
              <PasswordInput
                label="Confirm password"
                onChangePassword={setNewValue(setPasswordConfirm)}
                onBlurPassword={checkMatchPasswords}
              />
              <Button
                type="submit"
                color="teal"
                fluid
                size="large"
                loading={isLoading}
              >
                Change Password
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
      {isExit && <Redirect to="/" />}
    </>
  );
};

ChangePassword.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired
};
export default ChangePassword;
