import React from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function BasicDatePicker(props) {

  return ( 
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
            disableToolbar
            clearable
            format="MM/dd/yyyy"
            margin="normal"
            label={props.label}
            value={props.value}
            openTo="year"
            views={["year", "month", "date"]}
            onChange={props.onChange}
            KeyboardButtonProps={{
            'aria-label': 'change date',
            }}
        />
    </MuiPickersUtilsProvider>
  );
}