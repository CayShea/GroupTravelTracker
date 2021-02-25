import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/authActions';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Fab from "@material-ui/core/Fab";
import Paper from '@material-ui/core/Paper';
import useStyles from '../style';
import api from '../api';


Profile.propTypes = {
    user_email: PropTypes.string,
    user_displayName: PropTypes.string,
    user_photo: PropTypes.string
};

function Profile(props) {
    const classes = useStyles();
    const [ email, setEmail ] = useState(props.user_email);
    const [ avatar, setAvatar ] = useState(props.user_photo);
    const [ displayName, setDisplayName ] = useState(props.user_displayName);
    const [ password1, setPassword1 ] = useState(null);
    const [ password2, setPassword2 ] = useState(null);
    const [ formSubmitted, setFormSubmitted ] = useState(false);
    const [ fieldError, setFieldError ] = useState(false);
    const [ open, setOpen ] = useState(false);
    const  [ hasError, setError ] =  useState(false);

    useEffect(() => {
        if (props.error) {
          setFieldError(true);
          setFormSubmitted(false);
        };
    });

    const handleFormFieldChange = (event) => {
        switch(event.target.id) {
          case 'email': setEmail(event.target.value); break;
          case 'displayName': setDisplayName(event.target.value); break;
          case 'password1': setPassword1(event.target.value); break;
          case 'password2': setPassword2(event.target.value); break;
          default: return null;
        }
    };

    async function handleEditProfile(e) {
        e.preventDefault();
        let formData = new FormData();
        if (avatar && avatar !== props.user_photo) {
            formData.append('photo', avatar);
        };
        if (email !== props.user_email) {
            formData.append("email", email);
        };
        if (displayName !== props.user_displayName) {
            formData.append('display_name', displayName);
        };
        try {
            const res = await fetch(api.users.edit(props.token, formData));
            res.json()
            .then((res) => {
                // need to update the STORE with the details...
                console.log(res)
                props.updateUser(res.email, res.displayName, res.photo);
            })
        } catch (err) {
            setError(err)
        }
        setFormSubmitted(true);
    };

    async function handleChangePassword() {

    };
    
    const handleClose = () => {
        setOpen(false);
        window.location.reload();
    };

    const handleUploadClick = event => {
        var file = event.target.files[0];
        setAvatar(file);
    };

    return (
        <Container maxWidth="md" maxWidth="lg">
            <div className={classes.paper}>
        {/* //  enctype="multipart/form-data"> */}
          {/* { fieldError ? 
            (
                <Grid container spacing={3} direction="row" justify="center" alignItems="center">
                    <Grid item xs={12} align="center">
                        <Avatar className={classes.profileAvatar} alt={props.user_displayName} src={props.user_photo} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <Paper className={classes.fixedHeightPaperCenterAlign}>
                        <TextField
                            error
                            helperText="Required"
                            name="displayName"
                            variant="outlined"
                            required
                            fullWidth
                            id="displayName"
                            label="Display Name"
                            autoFocus
                            onChange={handleFormFieldChange}
                        />
                        <TextField
                            error
                            helperText="Required"
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            onChange={handleFormFieldChange}
                        />
                    </Paper>
                     </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <Paper className={classes.fixedHeightPaperCenterAlign}>
                        <TextField
                            error
                            helperText="Required"
                            variant="outlined"
                            required
                            fullWidth
                            name="password1"
                            label="Password"
                            type="password"
                            id="password1"
                            onChange={handleFormFieldChange}
                        />
                        <TextField
                            error
                            helperText="Passwords must match and be longer than 8 characters."
                            variant="outlined"
                            required
                            fullWidth
                            name="password2"
                            label="Password"
                            type="password"
                            id="password2"
                            onChange={handleFormFieldChange}
                        />
                    </Paper>
                    </Grid>
                </Grid>
            ) : ( */}
            <form encType="multipart/form-data" className={classes.form} onSubmit={handleEditProfile}>
                <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                    <Grid item xs={12} md={6} lg={6} align="center">
                        <input
                            accept="image/*"
                            className={classes.input}
                            id="contained-button-file"
                            type="file"
                            onChange={handleUploadClick}
                        />
                        <label htmlFor="contained-button-file">
                            <Fab component="span">
                                <Badge
                                    overlap="circle"
                                    anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                                    badgeContent={<EditIcon /> }
                                >
                                    {/* https://medium.com/@emeruchecole9/uploading-images-to-rest-api-backend-in-react-js-b931376b5833 */}
                                    <Avatar className={classes.profileAvatar} alt={props.user_displayName} src={props.user_photo} />
                                    {/* src={avatar && avatar != 'null' ? URL.createObjectURL(avatar) : ''} */}
                                </Badge>
                            </Fab>
                        </label>
                        <Paper className={classes.profilePaperBlocks}>
                            <TextField
                                name="displayName"
                                variant="outlined"
                                required
                                fullWidth
                                id="displayName"
                                label="Display Name"
                                autoFocus
                                value={displayName}
                                onChange={handleFormFieldChange}
                                className={classes.textField}
                            />
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={handleFormFieldChange}
                                className={classes.textField}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Save Changes to Profile
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </form>
            <form className={classes.form} noValidate onSubmit={handleChangePassword}>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item xs={12} md={6} lg={6} align="center">
                        <Paper className={classes.profilePaperBlocks}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password1"
                                label="Password"
                                type="password"
                                id="password1"
                                onChange={handleFormFieldChange}
                                className={classes.textField}
                            />
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password2"
                                label="Enter Password again"
                                type="password"
                                id="password2"
                                onChange={handleFormFieldChange}
                                className={classes.textField}
                            />
                            <span>* Password must be longer than 8 characters.</span>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Change Password
                            </Button>
                        </Paper>
                    </Grid>
                    </Grid>
                </form>
            {/* )
          } */}
            <div>
                {/* <ConfirmEmailModel open={open} handleClose={handleClose}/> */}
            </div>
        </div>
    </Container>
    )
}


const mapDispatchToProps = dispatch => {
    return {
        updateUser: (email, displayName, photo) => dispatch(actions.updateUser(email, displayName, photo))
    }
}

export default connect(null, mapDispatchToProps)(Profile);