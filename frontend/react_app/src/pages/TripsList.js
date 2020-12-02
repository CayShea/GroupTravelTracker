import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

import useStyles from '../style';
import CreateTrip from '../components/CreateTrip';
import TableList from '../components/TableList';
import api from '../api';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#2196f3",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

export default function TripsList(props) {
    const  [ hasError, setErrors ] =  useState(false);
    const  [ trips, setTrips ]= useState([]);
    const classes = useStyles();

   
    const headCells = [
      { id: 'name', numeric: false, disablePadding: false, label: 'Trip Name' },
      { id: 'startdate', numeric: false, disablePadding: false, label: 'Start Date' },
      { id: 'start_location', numeric: false, disablePadding: false, label: 'Location' },
      { id: 'budget', numeric: false, disablePadding: false, label: 'Budget' },
      { id: 'classification', numeric: false, disablePadding: false, label: 'Classification' },
    ];

    async function fetchData() {
        const res = await fetch(api.trips.list(props.token));
        res.json()
        .then(res => {
            setTrips(res)
        })
        .catch(err => setErrors(err));
    };
    useEffect(() => {
        fetchData();
    }, []);


    return (
      <div>
        <CreateTrip reloadScreen={fetchData} token={props.token}></CreateTrip>
        <TableList trips={trips} headCells={headCells} tableTitle={'Trips'} token={props.token} fetchData={fetchData}></TableList>
      </div>
    );
}
