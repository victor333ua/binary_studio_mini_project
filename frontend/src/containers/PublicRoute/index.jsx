import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const PublicRoute = ({ component: Component, ...rest }) => {
  const isAuthorized = useSelector(state => state.profile.isAuthorized);
  return (
    <Route
      {...rest}
      render={props => (isAuthorized
        ? <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        : <Component {...props} />)}
    />
  );
};
PublicRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.objectOf(PropTypes.any)
};
PublicRoute.defaultProps = {
  location: undefined
};
export default PublicRoute;
