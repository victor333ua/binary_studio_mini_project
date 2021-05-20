
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Thread from 'src/containers/Thread';
import LoginPage from 'src/components/LoginPage';
import RegistrationPage from 'src/containers/RegistrationPage';
import Profile from 'src/containers/Profile';
import Header from 'src/components/Header';
import SharedPost from 'src/containers/SharedPost';
import NotFound from 'src/scenes/NotFound';
import PrivateRoute from 'src/containers/PrivateRoute';
import PublicRoute from 'src/containers/PublicRoute';
import Notifications from 'src/components/Notifications';
import { logout } from 'src/containers/Profile/actions';
import PropTypes from 'prop-types';

const Routing = ({
  user,
  isAuthorized,
  logout: signOut
}) => (
  <div className="fill">
    {isAuthorized && (
      <header>
        <Header user={user} logout={signOut}/>
      </header>
    )}
    <main className="fill">
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <PublicRoute exact path="/registration" component={RegistrationPage}/>
        <PrivateRoute exact path="/" component={Thread}/>
        <PrivateRoute exact path="/profile" component={Profile}/>
        <PrivateRoute path="/share/:postHash" component={SharedPost}/>
        <Route path="*" exact component={NotFound}/>
      </Switch>
    </main>
    {isAuthorized && <Notifications user={user} />}
  </div>
);

Routing.propTypes = {
  isAuthorized: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any)
};

Routing.defaultProps = {
  isAuthorized: false,
  user: {}
};

const actions = { logout };

const mapStateToProps = ({ profile }) => ({
  isAuthorized: profile.isAuthorized,
  user: profile.user
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Routing);
