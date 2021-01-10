import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';

import TripSummary from '../components/TripSummary';
import useStyles from '../style';


export default function Dashboard(props) {
    const classes = useStyles();

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
            {/* Calendar */}
            <Grid item xs={12} md={4} lg={4}>
                <Paper className={classes.fixedHeightPaper}>

                </Paper>
            </Grid>
            {/* Map Overview*/}
            <Grid item xs={12} md={4} lg={4}>
                <Paper className={classes.fixedHeightPaper}>
                {/* <MapOverview start_location={tripDetails.start_location} apiKey={("AIzaSyA6iG7LGNxxs_ZT6eIkTUWK1sCd9Xf6i9w")}/> */}
                </Paper>
            </Grid>
            {/* Budget */}
            <Grid item xs={12} md={4} lg={4}>
                <Paper className={classes.fixedHeightPaper}>
                {/* <BudgetOverview trip={tripDetails}/> */}
                </Paper>
            </Grid>
            {/* TripSummary */}
            <Grid item xs={12}>
                <Paper className={classes.secondaryPaper}>
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
          