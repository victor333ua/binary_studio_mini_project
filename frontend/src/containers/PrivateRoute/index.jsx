import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthorized = useSelector(state => state.profile.isAuthorized);
  return (
    <Route
      {...rest}
      render={props => (isAuthorized
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)}
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any)
};
PrivateRoute.defaultProps = {
  location: undefined
};
export default PrivateRoute;
