import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';

import useStyles from '../style';


TravelerDropdown.propTypes = {
    initialValue: PropTypes.object,
};


export default function TravelerDropdown (props) {
    const classes = useStyles();

    const onNameSelect = (event, newValue) => {
            if (newValue) {
                console.log("new value....", newValue.display_name)
                props.setAssigned(newValue.display_name);
            } else {
                props.setAssigned('')
            }
    }

    return (
        <div style={{backgroundColor: 'white'}}>
            { props.initialValue ? (
                <Autocomplete
                    id="tags-outlined"
                    options={props.travelerOptions}
                    value={props.initialValue}
                    getOptionLabel={(option) => option.display_name}
                    filterSelectedOptions
                    onChange={onNameSelect}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Assign To (optional)"
                            variant="outlined"
                            placeholder="Travelers"
                        />
                    )}
                />
            ) : (
                <Autocomplete
                    id="tags-outlined"
                    options={props.travelerOptions}
                    getOptionLabel={(option) => option.display_name}
                    filterSelectedOptions
                    onChange={onNameSelect}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Assign To (optional)"
                            variant="outlined"
                            placeholder="Travelers"
                        />
                    )}
                />
            )}
        </div>
    )
}