import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import RoomIcon from '@material-ui/icons/Room';
import CreateIcon from '@material-ui/icons/Create';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import BasicTimePicker from './BasicTimePicker';

import useStyles from '../style';
import api from '../api';


EventForm.propTypes = {
    token: PropTypes.string,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    // refetchTrip: PropTypes.func,
    // showCreateForm: PropTypes.bool,
    // eventDetails: PropTypes.object,
};

export default function EventForm (props) {
    const classes = useStyles();
    const [ nameError, setNameError ] = useState(false);
    const [ newEvent, setNewEvent ] = useState({
        trip_id: props.trip.id,
        title: '',
        body: '',
        start: props.defaultStartEventTime,
        end: props.defaultEndEventTime,
        location: '',
        location_string: '',
        attendees: [],
        isPrivate: false
    });

    const handleChange = (prop) => (event) => {
        setNewEvent({ ...newEvent, [prop]: event.target.value });
      };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newEvent['title'] == "") {
            setNameError(true);
        } else {
            createOrEditEvent();
        }
    };

    async function createOrEditEvent() {
        newEvent['location_string'] = newEvent.location;
        delete newEvent.location;
        // let url = props.showCreateForm ? api.events.create : api.events.edit;
        try {
          const res = await fetch(api.events.create(props.token, newEvent));
          res.json()
          .then(() => {
              props.refetchEvents();
              props.handleClose();
            }
          )
        } catch (err) {
          props.setErrors(err)
        }
    };


    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogContent>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item sm={1}>
                      <LocalOfferIcon color="disabled"/>
                    </Grid>
                    <Grid item sm={11}>
                        { nameError ? 
                            (
                                <TextField
                                    error
                                    helperText="Required"
                                    autoFocus
                                    margin="dense"
                                    id="title"
                                    label="Event"
                                    value={newEvent.title}
                                    onChange={handleChange('title')}
                                    type="text"
                                    fullWidth
                                    required
                                />
                            ) : (
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="title"
                                    label="Event"
                                    value={newEvent.title}
                                    onChange={handleChange('title')}
                                    type="text"
                                    fullWidth
                                    required
                                />
                            ) 
                        }
                    </Grid>
                    <Grid item sm={1}>
                      <RoomIcon color="disabled"/>
                    </Grid>
                    <Grid item sm={9}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="start_location"
                            label="Location"
                            value={newEvent.location_string}
                            onChange={handleChange('location_string')}
                            type="text"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <BasicTimePicker 
                            label="Start *"
                            value={newEvent.start}
                            handleChange={handleChange('start')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <BasicTimePicker 
                            label="End *"
                            value={newEvent.end}
                            handleChange={handleChange('end')}
                        />
                    </Grid>
                    <Grid item sm={1}>
                      <CreateIcon color="disabled"/>
                    </Grid>
                    <Grid item sm={11}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="body"
                            label="Details / Notes"
                            value={newEvent.body}
                            onChange={handleChange('body')}
                            type="text"
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={props.handleClose}
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
                  Create
                </Button>
            </DialogActions>
        </Dialog>
    )
}
