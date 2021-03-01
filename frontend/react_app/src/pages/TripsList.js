import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';

import TableList from '../components/TableList';
import api from '../api';


export default function TripsList(props) {
    const  [ hasError, setErrors ] =  useState(false);
    const  [ trips, setTrips ]= useState([]);

   
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
            <Grid container justify="center" alignItems="center">
              <Grid xs={11} item >
                <TableList trips={trips} headCells={headCells} tableTitle={'Trips'} token={props.token} fetchData={fetchData} ></TableList>
              </Grid>     
            </Grid>
          </div>
    );
}
