import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import TripsList from '../pages/TripsList';
import TripDetails from '../pages/TripDetails';

function PrivateRoute({ isAuthenticated, children, ...rest}) {
    console.log("is authenticated??", isAuthenticated)
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
                <Switch>
                    <Route exact path="/login/"> <Login {...props} /></Route>
                    <Route exact path="/signup/"> <SignUp {...props} /></Route>
                    <PrivateRoute exact path="/trips" isAuthenticated={props.isAuthenticated}><TripsList {...props}/></PrivateRoute>
                    <PrivateRoute exact path="/trips/:id" isAuthenticated={props.isAuthenticated}><TripDetails {...props}/></PrivateRoute>
                </Switch>
            </BrowserRouter>
        </div>
    )
};

export default Urls;