import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import {
  TripsList,
  TripDetails
} from '../pages';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/trips" component={TripsList} isPrivate />
      <Route path="/trips/:id" component={TripDetails} isPrivate />
      {/* redirect user to Login page if route does not exist and user is not authenticated */}
      <Route component={Login} />
    </Switch>
  );
}