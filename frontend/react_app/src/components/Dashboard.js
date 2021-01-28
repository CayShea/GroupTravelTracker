import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';

import TripSummary from '../components/TripSummary';
import Itinerary from '../components/Itinerary';
import useStyles from '../style';


export default function Dashboard(props) {
    const classes = useStyles();

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
            {/* Itinerary */}
            <Grid item xs={12} md={6} lg={6}>
                <Paper className={classes.fixedHeightPaper}>
                    {props.tripDetails && props.events.length > 0 ? 
                        (
                            <Itinerary trip={props.tripDetails} events={props.events}/>
                        ) : (
                            <div>No Events yet (to do- need to decide what to display when no Events to show for Itinerary)</div>
                        )
                    }
                </Paper>
            </Grid>
            {/* Map Overview*/}
            <Grid item xs={12} md={6} lg={6}>
                <Paper className={classes.fixedHeightPaper}>
                {/* <MapOverview start_location={tripDetails.start_location} apiKey={("AIzaSyA6iG7LGNxxs_ZT6eIkTUWK1sCd9Xf6i9w")}/> */}
                </Paper>
            </Grid>
            {/* Budget */}
            <Grid item xs={12} md={6} lg={6}>
                <Paper className={classes.fixedHeightPaper}>
                {/* <BudgetOverview trip={tripDetails}/> */}
                </Paper>
            </Grid>
            {/* TripSummary */}
            <Grid item xs={12} md={6} lg={6}>
                <Paper className={classes.fixedHeightPaper}>
                    <TripSummary trip={props.tripDetails}/>
                </Paper>
            </Grid>
            {/* Recent Orders
            <Grid item xs={12}>
                <Paper className={classes.secondaryPaper}>
                <Orders />
                </Paper>
            </Grid> */}
            </Grid>
        </Container>
    )
}
          