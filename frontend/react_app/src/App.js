import React from 'react';
import Urls from './routes/urls';
import {connect} from 'react-redux';
import * as actions from './store/authActions';

function App(props) {

  React.useEffect(() => {
    props.setAuthenticatedIfRequired();
  }, []);

  return (
    <div className="App">
      <Urls {...props}/>
    </div>
  );
}

//This means that one or more of the redux states in the store are available as props
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null && typeof state.auth.token !== 'undefined',
    error: state.auth.error,
    token: state.auth.token,
    user_displayName: state.auth.user_displayName,
    user_email: state.auth.user_email,
    user_photo: state.auth.user_photo
  }
}

//This means that one or more of the redux actions in the form of dispatch(action) combinations are available as props
const mapDispatchToProps = (dispatch) => {
  return {
    setAuthenticatedIfRequired: () => dispatch(actions.authCheckState()),
    logout: () => dispatch(actions.authLogout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);