import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Footer from "./Footer"

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
        <div>
            { props.isToday ? 
                (
                    <Paper className={classes.itineraryRowToday}>
                        <Grid
                            container
                            direction="row"
                            justify="space-around"
                        >
                            <Grid item >TODAY: {props.title}</Grid>
                            <Grid item >{startTime}</Grid>
                        </Grid>
                    </Paper>
                ) : (
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
        </div>
    )
}

function Itinerary(props) {
    const events = props.events;
    const firstEventIndex = props.firstEventIndex;
    const todayEventsArray = props.todayEventsArray;
    const rows = [];
    const lastIndex = (props.events.length - 1);

    if (props.withinRangeOfToday) {
        const remainderEventRowIndexes = (lastIndex - firstEventIndex + 1) - todayEventsArray.length;

        todayEventsArray.forEach((value, i) => {
            rows.push(<EventRow title={value.title} start={value.start} key={value.id} isToday={true}/>)
        });
        for (let i = 0; i < remainderEventRowIndexes; i++) {
            let value = events[i];
            rows.push(<EventRow title={value.title} start={value.start} key={i} isToday={false}/>)
        };
    
    } else {
        for (let i = firstEventIndex; i <= lastIndex; i++) {
            let value = events[i];
            rows.push(<EventRow title={value.title} start={value.start} key={i} isToday={false}/>)
        };
    }

    return (
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {rows}
                </Grid>
            </Grid>
            <Footer />
        </Container>
    )
}

export default Itinerary;
