import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Thread from 'src/containers/Thread';
import LoginPage from 'src/components/LoginPage';
import RegistrationPage from 'src/components/RegistrationPage';
import Profile from 'src/containers/Profile';
import Header from 'src/components/Header';
import SharedPost from 'src/containers/SharedPost';
import NotFound from 'src/scenes/NotFound';
import PrivateRoute from 'src/containers/PrivateRoute';
import PublicRoute from 'src/containers/PublicRoute';
import Notifications from 'src/containers/Notifications';
import ChangePassword from 'src/components/ChangePassword';
import AdminPage from '../AdminPage';
import AdminRoute from '../AdminRoute';

const Routing = () => {
  const isAuthorized = useSelector(state => state.profile.isAuthorized);
  return (
    <div className="fill">
      {isAuthorized && (<header><Header /></header>)}
      <main className="fill">
        <Switch>
          <PublicRoute exact path="/login" component={LoginPage} />
          <PublicRoute exact path="/registration" component={RegistrationPage}/>
          <PrivateRoute exact path="/" component={Thread}/>
          <PrivateRoute exact path="/profile" component={Profile}/>
          <PrivateRoute path="/share/:postHash" component={SharedPost}/>
          <PublicRoute path="/reset/:token" component={ChangePassword}/>
          <AdminRoute exact path="/admin" component={AdminPage}/>
          <Route path="*" component={NotFound}/>
        </Switch>
      </main>
      <Notifications />
    </div>
  );
};
export default Routing;
