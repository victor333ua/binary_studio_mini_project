import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ADMIN } from '../../scenes/rolesConstants';

const AdminRoute = ({ component: Component, ...rest }) => {
  const isAuthorized = useSelector(state => state.profile.isAuthorized);
  const user = useSelector(state => state.profile.user);

  return (
    <Route
      {...rest}
      render={props => (
        isAuthorized && user.roles[0].name === ADMIN
          ? <Component {...props} />
          : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      )}
    />
  );
};
AdminRoute.propTypes = {
  component: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any)
};
AdminRoute.defaultProps = {
  location: undefined
};
export default AdminRoute;
