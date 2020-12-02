import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
import { startOfToday } from 'date-fns'
import Grid from '@material-ui/core/Grid';

import BasicDatePicker from '../components/BasicDatePicker';
import useStyles from '../style';
import api from '../api';

export default function CreateTrip(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const  [ hasError, setErrors ] =  useState(false);
  const [values, setValues] = useState({
    name: '',
    start_location: '',
    summary: '',
    budget: '',
    classification: 'none',
    startdate: JSON.stringify(startOfToday()).substring(1, 11),
    enddate: JSON.stringify(startOfToday()).substring(1, 11)
  });

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

  const handleCreateTrip = (e) => {
      e.preventDefault();
      createTrip();
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
  }

  return (
    <div className={classes.root}>
            <IconButton color="primary" aria-label="create trip" onClick={handleClickOpen}>
                <AddCircleIcon fontSize="large"/>
            </IconButton>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create New Trip</DialogTitle>
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
                    onClick={handleCreateTrip}
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Create
                </Button>
                </DialogActions>
            </Dialog>
    </div>
  );
}