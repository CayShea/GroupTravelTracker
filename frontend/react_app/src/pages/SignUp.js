import React from 'react';
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
import useStyles from '../style';
import ConfirmEmailModel from '../components/modals/ConfirmEmailModal';


function SignUp(props) {
  const classes = useStyles();
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [displayName, setDisplayName] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } }

  React.useEffect(() => {
    if (props.isAuthenticated) { history.replace(from) }
  });

  const handleFormFieldChange = (event) => {
    switch(event.target.id) {
      case 'email': setEmail(event.target.value); break;
      case 'password': setPassword(event.target.value); break;
      case 'displayName': setDisplayName(event.target.value); break;
      default: return null;
    }
 };

 const handleSubmit = (e) => {
  e.preventDefault();
  props.onAuth(email, password, displayName);
  setOpen(true);
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="displayName"
                variant="outlined"
                required
                fullWidth
                id="displayName"
                label="Display Name"
                autoFocus
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
                name="email"
                autoComplete="email"
                onChange={handleFormFieldChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleFormFieldChange}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}
          </Grid>
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
    </Container>
  );
}


const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, displayName) => dispatch(actions.authSignup(email, password, displayName))
  }
}

export default connect(null, mapDispatchToProps)(SignUp);