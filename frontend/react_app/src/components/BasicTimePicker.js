import React from 'react';
import 'date-fns';
import TextField from '@material-ui/core/TextField';

import useStyles from '../style';

export default function BasicDatePicker(props) {
  const classes = useStyles();
  

  return ( 
    <form className={classes.container} noValidate>
      <TextField
        id={props.label}
        label={props.label}
        type="datetime-local"
        defaultValue={props.value}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={props.handleChange}
      />
    </form>
  );
}