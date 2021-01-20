import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import { startOfToday } from 'date-fns';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import BasicDatePicker from './BasicDatePicker';
import useStyles from '../style';
import api from '../api';


CreateTrip.propTypes = {
    token: PropTypes.string,
    reloadScreen: PropTypes.func,
    create: PropTypes.bool,
    icon: PropTypes.string,
    tripDetails: PropTypes.object,
};
CreateTrip.defaultProps = {
    create: true,
    icon: 'AddCircleIcon',
    tripDetails: {
        name: '',
        start_location: '',
        summary: '',
        budget: '',
        classification: 'none',
        members: [],
        startdate: JSON.stringify(startOfToday()).substring(1, 11),
        enddate: JSON.stringify(startOfToday()).substring(1, 11)
    }
};

export default function CreateTrip(props) {
  const classes = useStyles();
  const members = props.tripDetails.members;
  const [open, setOpen] = useState(false);
  const  [ hasError, setErrors ] =  useState(false);
  const [values, setValues] = useState(props.tripDetails);
  const [ currentMembers, setCurrentMembers ] = useState(members);
  const  [ users, setUsers ]= useState([]);

  async function fetchData() {
    const allUsers = await fetch(api.users.list(props.token));
    allUsers.json()
    .then(allUsers => {
        currentMembers.forEach(function(item) {
            let ItemIndex = allUsers.findIndex(member => member.display_name === item.display_name);
            allUsers.splice(ItemIndex, 1);
        });
        if (props.tripDetails.owner) {
            const tripOwnerIndex = allUsers.findIndex(member => member.display_name === props.tripDetails.owner.display_name);
            allUsers.splice(tripOwnerIndex, 1);
        }
        setUsers(allUsers);
    })
    .catch(err => setErrors(err));
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleStartDateChange = (date) => {
    setValues({ ...values, ['startdate']: JSON.stringify(date).substring(1, 11) })
  };

  const handleEndDateChange = (date) => {
    setValues({ ...values, ['enddate']: JSON.stringify(date).substring(1, 11) })
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      props.create ? createTrip() : updateTrip();
  };

  async function createTrip() {
      try {
        const res = await fetch(api.trips.create(props.token, values));
        res.json()
        .then(() => {
            handleClose();
            props.reloadScreen();
        }
        )
      } catch (err) {
        setErrors(err)
      }
  };

  async function updateTrip() {
    try {
        delete values.owner;
        updateTripMembers();
        const res = await fetch(api.trips.edit(props.token, values));
        res.json()
        .then(() => {
            handleClose();
            props.reloadScreen();
        }
    )} catch (err) {
        setErrors(err);
  }};

  async function updateTripMembers() {
    if (currentMembers) {
        try {
            const display_names = currentMembers.map((x) => x.display_name)
            const res = await fetch(api.tripMembers.create(props.token, display_names, props.tripDetails.id));
            res.json()
            .then(() => {
                console.log(res)
            })
        } catch (err) {
            setErrors(err);
        }
    }
  };


  return (
    <div className={classes.root}>
        { props.create ? 
            ( 
                <IconButton color="primary" aria-label="create trip" onClick={handleClickOpen}>
                    <AddCircleIcon fontSize="large"/>
                </IconButton>
            ) : (
                <IconButton color="inherit" aria-label="edit trip" onClick={handleClickOpen}>
                    <EditIcon/> 
                </IconButton>
            )
        }
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                {props.create ? "Create New Trip" : `Edit ${props.tripDetails.name}`}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item sm={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Trip Name"
                            value={values.name}
                            onChange={handleChange('name')}
                            type="text"
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <BasicDatePicker 
                            label="Start Date"
                            value={values.startdate}
                            onChange={handleStartDateChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <BasicDatePicker 
                            label="End Date"
                            value={values.enddate}
                            onChange={handleEndDateChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="location"
                            label="Location"
                            value={values.start_location}
                            onChange={handleChange('start_location')}
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl className={classes.margin} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-amount">Budget</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                value={values.budget}
                                onChange={handleChange('budget')}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                labelWidth={60}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item sm={12}>
                        {/* Add Travelers */}
                        <div className={classes.dropdownInput}>
                            { users.length > 0 ? (
                                <Autocomplete
                                    multiple
                                    id="tags-outlined"
                                    options={users} //tech-debt: (remove the current owner of the trip)
                                    getOptionLabel={(option) => option.display_name}
                                    filterSelectedOptions
                                    value={currentMembers}
                                    onChange={(event, newValue) => {
                                        setCurrentMembers([
                                        ...newValue
                                        ]);
                                    }}
                                    renderTags={(tagValue, getTagProps) =>
                                        tagValue.map((option, index) => (
                                        <Chip
                                            label={option.display_name}
                                            {...getTagProps({ index })}
                                        />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                        {...params}
                                        variant="standard"
                                        placeholder="Travelers"
                                        />
                                    )}
                                />
                            ) : (
                                <div></div>
                            )}
                            </div>
                    </Grid>
                    <Grid item sm={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="summary"
                            label="Short Description"
                            value={values.summary}
                            onChange={handleChange('summary')}
                            type="text"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth className={classes.formControl}>
                            <InputLabel htmlFor="classification">Classification</InputLabel>
                            <Select
                            native
                            value={values.classification}
                            onChange={handleChange('classification')}
                            inputProps={{
                                name: 'classification',
                                id: 'classification',
                            }}
                            >
                            <option aria-label="None" value="{'none'}" />
                            <option value={'work'}>Business</option>
                            <option value={'pleasure'}>Pleasure</option>
                            <option value={'both'}>Both</option>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleClose}
                    variant="contained"
                    className={classes.submit}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    {props.create ? "Create" : "Update"}
                </Button>
                </DialogActions>
        </Dialog>
    </div>
  )
}