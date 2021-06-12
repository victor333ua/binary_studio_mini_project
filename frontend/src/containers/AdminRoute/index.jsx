import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { ADMIN } from '../../scenes/rolesConstants';

const AdminRoute = ({ component: Component, user, isAuthorized, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      isAuthorized && user.roles[0].name === ADMIN
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
    )}
  />
);
AdminRoute.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  component: PropTypes.any.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  isAuthorized: PropTypes.bool,
  location: PropTypes.any // eslint-disable-line
};
AdminRoute.defaultProps = {
  isAuthorized: false
};

const mapStateToProps = rootState => ({
  user: rootState.profile.user,
  isAuthorized: rootState.profile.isAuthorized
});

export default connect(mapStateToProps)(AdminRoute);
