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
    const [ avatar, setAvatar ] = useState(props.user_photo);
    const [ displayPhoto, setDisplayPhoto ] = useState(props.user_photo);
    const [ displayName, setDisplayName ] = useState(props.user_displayName);
    const [ oldpassword, setOldPassword ] = useState(null);
    const [ password1, setPassword1 ] = useState(null);
    const [ password2, setPassword2 ] = useState(null);
    const [ editProfileError, setEditProfileError ] = useState('');
    const [ passwordError, setPasswordError ] = useState('');
    const [ passwordUpdated, setPasswordUpdated ] = useState(false);
    const  [ hasError, setError ] =  useState(false);


    const handleFormFieldChange = (event) => {
        switch(event.target.id) {
          case 'displayName': setDisplayName(event.target.value); break;
          case 'oldpassword': setOldPassword(event.target.value); break;
          case 'password1': setPassword1(event.target.value); break;
          case 'password2': setPassword2(event.target.value); break;
          default: return null;
        }
    };

    async function handleEditProfile(e) {
        e.preventDefault();
        let formData = new FormData();
        if (avatar !== props.user_photo) {
            formData.append('photo', avatar);
        };
        formData.append('display_name', displayName);
        try {
            const res = await fetch(api.users.edit(props.token, formData));
            res.json()
            .then((res) => {
                if (!res.ok) {
                    setEditProfileError(Object.values(res)[0]);
                } else {
                    props.updateUser(res.display_name, res.photo);
                }
            })
        } catch (err) {
            setError(err)
        }
    };

    async function handleChangePassword(e) {
        e.preventDefault();
        let formData = new FormData();
        formData.append('old_password', oldpassword);
        formData.append('new_password1', password1);
        formData.append('new_password2', password2);
        try {
            const res = await fetch(api.users.passwordChange(props.token, formData));
            res.json()
            console.log("Can I see the res stqatus here ???", res.ok)
            if (!res.ok) {
                console.log("I am entering here", Object.values(res)[0])
                setPasswordError(Object.values(res)[0]);
            } else {
                setPasswordUpdated(true);
            }
        } catch (err) {
            console.log("I am seeing the error...")
            setError(err)
        }
    };

    const handleUploadClick = event => {
        var file = event.target.files[0];
        setAvatar(file);
        setDisplayPhoto(URL.createObjectURL(file))
    };

    return (
        <Container maxWidth="md" maxWidth="lg">
            <div className={classes.paper}>
            { editProfileError ? 
                (
                    <form encType="multipart/form-data" className={classes.form} onSubmit={handleEditProfile}>
                        <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                            <Grid item xs={12} md={6} lg={6} align="center">
                                <Paper className={classes.profilePaperBlocks}>
                                    <span className={classes.redText}>* {editProfileError}</span>
                                    <input
                                        accept="image/*"
                                        className={classes.input}
                                        id="contained-button-file"
                                        type="file"
                                        onChange={handleUploadClick}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Fab component="span" className={classes.marginTopBottom}>
                                            <Badge
                                                overlap="circle"
                                                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                                                badgeContent={<EditIcon /> }
                                            >
                                                <Avatar className={classes.profileAvatar} alt={props.user_displayName} src={displayPhoto} />
                                            </Badge>
                                        </Fab>
                                    </label>
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
                                        error
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
                ) : ( 
                    <form encType="multipart/form-data" className={classes.form} onSubmit={handleEditProfile}>
                        <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                            <Grid item xs={12} md={6} lg={6} align="center">
                                <Paper className={classes.profilePaperBlocks}>
                                    <input
                                        accept="image/*"
                                        className={classes.input}
                                        id="contained-button-file"
                                        type="file"
                                        onChange={handleUploadClick}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Fab component="span" className={classes.marginTopBottom}>
                                            <Badge
                                                overlap="circle"
                                                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                                                badgeContent={<EditIcon /> }
                                            >
                                                <Avatar className={classes.profileAvatar} alt={props.user_displayName} src={displayPhoto} />
                                            </Badge>
                                        </Fab>
                                    </label>
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
                )
            }
            { passwordError ?
                (
                    <form className={classes.form} noValidate onSubmit={handleChangePassword}>
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Grid item xs={12} md={6} lg={6} align="center">
                                <Paper className={classes.profilePaperBlocks}>
                                    <span className={classes.redText}>* {passwordError}</span>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="oldpassword"
                                        label="Current Password"
                                        type="password"
                                        id="oldpassword"
                                        onChange={handleFormFieldChange}
                                        className={classes.textField}
                                        error
                                    />
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password1"
                                        label="New Password"
                                        type="password"
                                        id="password1"
                                        onChange={handleFormFieldChange}
                                        className={classes.textField}
                                        error
                                    />
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password2"
                                        label="Enter New Password again"
                                        type="password"
                                        id="password2"
                                        onChange={handleFormFieldChange}
                                        className={classes.textField}
                                        error
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
                ) : (
                    <form className={classes.form} noValidate onSubmit={handleChangePassword}>
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Grid item xs={12} md={6} lg={6} align="center">
                                <span>* Password has been updated</span>
                                <Paper className={classes.profilePaperBlocks}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="oldpassword"
                                        label="Current Password"
                                        type="password"
                                        id="oldpassword"
                                        onChange={handleFormFieldChange}
                                        className={classes.textField}
                                    />
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password1"
                                        label="New Password"
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
                                        label="Enter New Password again"
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
                )
            }
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
        updateUser: (displayName, photo) => dispatch(actions.updateUser(displayName, photo))
    }
}

export default connect(null, mapDispatchToProps)(Profile);