import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import TripsList from '../pages/TripsList';
import Profile from '../pages/Profile';
import TripDetails from '../pages/TripDetails';
import Layout from '../components/Layout';

function PrivateRoute({ isAuthenticated, children, ...rest}) {
    return (
        <Route
            {...rest}
            render={({ location }) => 
            isAuthenticated ? (
                children
            ) : (
                <Redirect
                    to={{
                        pathname: "/login/",
                        state: { from:location }
                    }}
                />
            )
            }
        />
    )
}

function Urls(props) {
    return (
        <div>
            <BrowserRouter>
                <Layout  {...props}>
                    <Switch>
                        <Route exact path="/login/"> <Login {...props} /></Route>
                        <Route exact path="/signup/"> <SignUp {...props} /></Route>
                        <PrivateRoute exact path="/trips" isAuthenticated={props.isAuthenticated}><TripsList {...props}/></PrivateRoute>
                        <PrivateRoute exact path="/trips/:id" isAuthenticated={props.isAuthenticated}><TripDetails {...props}/></PrivateRoute>
                        <PrivateRoute exact path="/profile/" isAuthenticated={props.isAuthenticated}><Profile {...props}/></PrivateRoute>
                        <PrivateRoute exact path="/" isAuthenticated={props.isAuthenticated}><TripsList {...props}/></PrivateRoute>
                    </Switch>
                </Layout>
            </BrowserRouter>
        </div>
    )
};

export default Urls;