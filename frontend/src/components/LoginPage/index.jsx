import React from 'react';
import Logo from 'src/components/Logo';
import { Grid, Header, Message } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import LoginForm from 'src/containers/LoginForm';
import PropTypes from 'prop-types';

const LoginPage = ({ location }) => (
  <Grid textAlign="center" verticalAlign="middle" className="fill">
    <Grid.Column style={{ maxWidth: 450 }}>
      <Logo />
      <Header as="h2" color="teal" textAlign="center">
        Login to your account
      </Header>
      <LoginForm location={location}/>
      <Message>
        New to us?
        {' '}
        <NavLink exact to="/registration">Sign Up</NavLink>
      </Message>
    </Grid.Column>
  </Grid>
);

LoginPage.defaultProps = {
  location: undefined
};

LoginPage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.any
};

export default LoginPage;

