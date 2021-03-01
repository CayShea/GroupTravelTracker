import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import MenuOpenRoundedIcon from '@material-ui/icons/MenuOpenRounded';

import TripSummary from '../components/TripSummary';
import ItineraryOverview from '../components/ItineraryOverview';
import useStyles from '../style';


export default function Dashboard(props) {
    const classes = useStyles();

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
            {/* ItineraryOverview */}
            <Grid item xs={12} md={6} lg={6}>
                <Paper className={classes.fixedHeightPaperCenterAlign}>
                    {props.tripDetails && props.events.length > 0 ? 
                        (
                            <ItineraryOverview 
                                trip={props.tripDetails} 
                                events={props.events}
                                withinRangeOfToday={props.withinRangeOfToday}
                                todayEventsArray={props.todayEventsArray}
                                firstEventIndex={props.firstEventIndex}
                            />
                        ) : (
                            <div></div>
                        )
                    }
                    <div>
                    <Tooltip title="Add Event">
                        <IconButton className={classes.whiteButton} aria-label="create event" onClick={() => alert("hook up to Create Event form")}>
                            <AddCircleIcon fontSize="large"/>
                        </IconButton>
                    </Tooltip>
                    {props.tripDetails && props.events.length > 0 ? 
                        (
                            <Tooltip title="View full Itinerary">
                                <IconButton className={classes.whiteButton} aria-label="itinerary" onClick={props.selectItinerary}>
                                    <MenuOpenRoundedIcon fontSize="large"/>
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <div></div>
                        )
                    }
                    </div>
                </Paper>
            </Grid>
            {/* Map Overview*/}
            <Grid item xs={12} md={6} lg={6}>
                <Paper className={classes.fixedHeightPaperCenterAlign}>
                {/* <MapOverview start_location={tripDetails.start_location} apiKey={("AIzaSyA6iG7LGNxxs_ZT6eIkTUWK1sCd9Xf6i9w")}/> */}
                </Paper>
            </Grid>
            {/* Budget */}
            <Grid item xs={12} md={6} lg={6}>
                <Paper className={classes.fixedHeightPaperCenterAlign}>
                {/* <BudgetOverview trip={tripDetails}/> */}
                </Paper>
            </Grid>
            {/* TripSummary */}
            <Grid item xs={12} md={6} lg={6}>
                <Paper className={classes.fixedHeightPaperLeftAlign}>
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
          