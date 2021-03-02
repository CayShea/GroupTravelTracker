import axios from 'axios';
import * as actionTypes from './authActionTypes';
import * as settings from '../settings';

const SESSION_DURATION = settings.SESSION_DURATION

// ########################################################
// ########################################################
// Auth Action Functions returning Action Objects
// ########################################################
// ########################################################

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, user_displayName, user_email, user_photo) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        user_displayName: user_displayName,
        user_email: user_email,
        user_photo: user_photo
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const authLogout = () => {
    const token = localStorage.getItem('token');
    if (token === undefined){
        localStorage.removeItem('expirationDate');
    } else {
        axios.post(`${settings.API_SERVER}/rest-auth/logout/`, {
        }, {headers: {'Authorization': `Token ${token}`}} ).then(res => {console.log(res)}).catch(err => {console.log(err)});
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('user_displayName');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_photo');
    }

    return {
        type: actionTypes.AUTH_LOGOUT
    };
}

// ########################################################
// ########################################################
// Auth Action Functions returning A Dispatch(Action) combination after performing some action
// ########################################################
// ########################################################

// This sets a timer, which would automatically logout the user after a specified time
export const authCheckTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(authLogout());
        }, expirationTime)
    }
}

export const authLogin = (email, password) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(`${settings.API_SERVER}/rest-auth/login/`, {
            email: email,
            password: password
        })
        .then(res => {
            const token = res.data.key;
            const expirationDate = new Date(new Date().getTime() + SESSION_DURATION );
            localStorage.setItem('token', token);
            localStorage.setItem('expirationDate', expirationDate);
            return axios({ method: 'get', url: `${settings.API_SERVER}/rest-auth/user/`, headers: {'Authorization': `Token ${token}`} })
        })
        .then(res => {
            const user = res.data;
            const token = localStorage.getItem('token');
            localStorage.setItem('user_displayName', user.display_name);
            localStorage.setItem('user_email', user.email);
            localStorage.setItem('user_photo', user.photo);
            dispatch(authSuccess(token, user.display_name, user.email, user.photo));
            dispatch(authCheckTimeout(SESSION_DURATION));
        })
        .catch(err => {
            dispatch(authFail(err))
        });
    }
}

export const authSignup = (email, password1, password2, displayName) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(`${settings.API_SERVER}/registration/`, {
            email: email,
            password1: password1,
            password2: password2,
            display_name: displayName
        })
        .then(res => {
            const token = res.data.key;
            const expirationDate = new Date(new Date().getTime() + SESSION_DURATION );
            localStorage.setItem('token', token);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(token));
            dispatch(authCheckTimeout(SESSION_DURATION));
        })
        .catch(err => {
            dispatch(authFail(err))
        });
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        const user_displayName = localStorage.getItem('user_displayName');
        const user_email = localStorage.getItem('user_email');
        const user_photo = localStorage.getItem('user_photo');
        if (token === undefined) {
            dispatch(authLogout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if ( expirationDate <= new Date() ) {
                dispatch(authLogout());
            } else {
                dispatch(authSuccess(token, user_displayName, user_email, user_photo));
                dispatch(authCheckTimeout( expirationDate.getTime() - new Date().getTime()) );
            }
        }
    }
}

export const updateUser = (email, displayName, photo) => {
    return dispatch => {
        const token = localStorage.getItem('token');
        localStorage.setItem('user_email', email)
        localStorage.setItem('user_displayName', displayName)
        localStorage.setItem('user_photo', photo);
        dispatch(authSuccess(token, email, displayName, photo))
    }
}