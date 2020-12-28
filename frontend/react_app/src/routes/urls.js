import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import TripsList from '../pages/TripsList';
import TripDetails from '../pages/TripDetails';
import CalendarScreen from '../pages/CalendarScreen';
import MapScreen from '../pages/MapScreen';
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
                        <PrivateRoute exact path="/calendar/" isAuthenticated={props.isAuthenticated}><CalendarScreen {...props} /></PrivateRoute>
                        <PrivateRoute exact path="/map/" isAuthenticated={props.isAuthenticated}><MapScreen {...props} /></PrivateRoute>
                        <PrivateRoute exact path="/" isAuthenticated={props.isAuthenticated}><TripsList {...props}/></PrivateRoute>
                    </Switch>
                </Layout>
            </BrowserRouter>
        </div>
    )
};

export default Urls;