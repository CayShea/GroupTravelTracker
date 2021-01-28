import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import useStyles from '../style';

const EventRow = (props) => {
    const classes = useStyles();
    const startDate = props.start.slice(5, 10);
    let startTime = props.start.slice(11, 16);
    const hourCheck = startTime.slice(0,2)
    if (Number(hourCheck) > 12) {
        const convertHour = (Number(hourCheck) - 12).toString();
        startTime = convertHour.concat(startTime.slice(2,5)).concat(" PM");
    } else {
        startTime = startTime.concat(" AM");
    };

    return (
        <Paper className={classes.itineraryRow}>
            <Grid
                container
                direction="row"
                justify="space-around"
            >
                <Grid item >{startDate}: {props.title}</Grid>
                <Grid item >{startTime}</Grid>
            </Grid>
        </Paper>
    )
}

function Itinerary(props) {
    const classes = useStyles();
    const events = props.events;
    const rows = [];
    // *************
    //      TECH DEBT - NEED to add in logic for showing 'Today' different and first

    // PSEUDOCODE for addition needed --->
    // first check if todays date is in range of trip. If not- set first event as start of array.
            // set the start event as events[0] and return only first 6 events thereafter.
    const firstEvent = 0;
    // ALL trips that are for 'today' date- set local state boolean for today to 'True' (so the color will display different)
    const lastIndex =  (events.length) < 5 ? events.length : firstEvent + 5;
    for (let i = firstEvent; i < lastIndex; i++) {
        let value = events[i];
        rows.push(<EventRow title={value.title} start={value.start} key={i} />)
    };

    return (
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {rows}
                </Grid>
            </Grid>
        </Container>
    )
}

export default Itinerary
