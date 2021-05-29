import React from 'react';
import Logo from 'src/components/Logo';
import { Grid, Header, Message } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import RegistrationForm from 'src/containers/RegistrationForm';

const RegistrationPage = () => (
  <Grid textAlign="center" verticalAlign="middle" className="fill">
    <Grid.Column style={{ maxWidth: 450 }}>
      <Logo />
      <Header as="h2" color="teal" textAlign="center">
        Register for free account
      </Header>
      <RegistrationForm />
      <Message>
        Already with us?
        {' '}
        <NavLink exact to="/login">Sign In</NavLink>
      </Message>
    </Grid.Column>
  </Grid>
);

export default RegistrationPage;
