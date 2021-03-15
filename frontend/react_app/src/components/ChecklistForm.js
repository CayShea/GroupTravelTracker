import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TitleIcon from '@material-ui/icons/Title';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import useStyles from '../style';
import api from '../api';
import TravelerDropdown from '../components/TravelerDropdown';


ChecklistForm.propTypes = {
    token: PropTypes.string,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    refetchTrip: PropTypes.func,
};

export default function ChecklistForm (props) {
    const classes = useStyles();
    const [ nameError, setNameError ] = useState(false);
    const [ newChecklist, setnewChecklist ] = useState({
        trip_id: props.trip.id,
        title: '',
        isprivate: 'false',
        assigned_to_name: ''
    });

    const handleChange = (prop) => (event) => {
        setnewChecklist({ ...newChecklist, [prop]: event.target.value });
    };

    const handleUpdateAssigned = (value) => {
        setnewChecklist({ ...newChecklist, ['assigned_to_name']: value});
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newChecklist['title'] == "") {
            setNameError(true);
        } else {
            createOrEditEvent();
        }
    };

    async function createOrEditEvent() {
        let url = props.showCreateForm ? api.checklist.create : api.checklist.edit;
        try {
          const res = await fetch(url(props.token, newChecklist));
          res.json()
          .then(() => {
              props.refetchTrip();
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
                      <TitleIcon color="disabled"/>
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
                                    label="Checklist Title"
                                    value={newChecklist.title}
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
                                    label="Checklist Title"
                                    value={newChecklist.title}
                                    onChange={handleChange('title')}
                                    type="text"
                                    fullWidth
                                    required
                                />
                            ) 
                        }
                    </Grid>
                    <Grid item sm={1}>
                      <LockIcon color="disabled"/>
                    </Grid>
                    <Grid item sm={11}>
                        <FormControl component="fieldset" color="primary">
                            <RadioGroup row color="primary" aria-label="isprivate" name="isprivate" value={newChecklist.isprivate} onChange={handleChange('isprivate')}>
                                <FormControlLabel color="primary" value="true" control={<Radio />} label="Private" />
                                <FormControlLabel color="primary" value="false" control={<Radio />} label="Public" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item sm={1}>
                      <PersonIcon color="disabled"/>
                    </Grid>
                    <Grid item sm={11}>
                        <TravelerDropdown
                            travelerOptions={props.trip.members}
                            setAssigned={handleUpdateAssigned}
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
