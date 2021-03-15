import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import * as actions from '../store/authActions';
import Footer from "../components/Footer";
import useStyles from '../style';
import ConfirmEmailModel from '../components/modals/ConfirmEmailModal';


function SignUp(props) {
  const classes = useStyles();
  const [ email, setEmail ] = useState('');
  const [ password1, setPassword1 ] = useState('');
  const [ password2, setPassword2 ] = useState('');
  const [ displayName, setDisplayName ] = useState('');
  const [ formSubmitted, setFormSubmitted ] = useState(false);
  const [ fieldError, setFieldError ] = useState(false);
  const [ open, setOpen ] = useState(false);

  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } }

  useEffect(() => {
    if (formSubmitted && !props.error) {
      setOpen(true) 
    };
  });

  useEffect(() => {
    if (props.error) {
      setFieldError(true);
      setFormSubmitted(false);
    };
  });

  const handleFormFieldChange = (event) => {
    switch(event.target.id) {
      case 'email': setEmail(event.target.value); break;
      case 'password1': setPassword1(event.target.value); break;
      case 'password2': setPassword2(event.target.value); break;
      case 'displayName': setDisplayName(event.target.value); break;
      default: return null;
    }
 };

 const handleSubmit = (e) => {
  e.preventDefault();
  // let formData = new FormData();
  // formData.append("email", email);
  // formData.append('password1', password1)
  // formData.append('password2', password2)
  // formData.append('display_name', displayName)
  // props.onAuth(formData);

  props.onAuth(email, password1, password2, displayName);
    setFormSubmitted(true);
  };

 const handleClose = () => {
  setOpen(false);
  window.location.reload();
 };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
        {/* //  enctype="multipart/form-data"> */}
          { fieldError ? 
            (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    error
                    helperText="Required"
                    variant="outlined"
                    required
                    fullWidth
                    id="displayName"
                    label="Display Name"
                    autoFocus
                    value={displayName}
                    onChange={handleFormFieldChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error
                    helperText="Required"
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    value={email}
                    onChange={handleFormFieldChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error
                    helperText="Required"
                    variant="outlined"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    id="password1"
                    value={password1}
                    onChange={handleFormFieldChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error
                    helperText="Passwords must match and be longer than 8 characters."
                    variant="outlined"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    id="password2"
                    value={password2}
                    onChange={handleFormFieldChange}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="displayName"
                    label="Display Name"
                    autoFocus
                    value={displayName}
                    onChange={handleFormFieldChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    value={email}
                    onChange={handleFormFieldChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    id="password1"
                    value={password1}
                    onChange={handleFormFieldChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    helperText="* Password must be longer than 8 characters."
                    label="Enter Password again"
                    type="password"
                    id="password2"
                    value={password2}
                    onChange={handleFormFieldChange}
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <div className={classes.uploadRow}>
                    <Typography className={classes.ternaryTitle} variant="p">
                      Profile Photo
                    </Typography>
                    <AvatarUpload uploadAvatar={uploadAvatar}/>
                  </div>
                </Grid> */}

                {/* <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid> */}
              </Grid>
            )
          }
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
        <div>
          <ConfirmEmailModel open={open} handleClose={handleClose}/>
        </div>
      </div>
      <Footer />
    </Container>
  );
}


const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password1, password2, displayName) => dispatch(actions.authSignup(email, password1, password2, displayName))
  }
}

export default connect(null, mapDispatchToProps)(SignUp);