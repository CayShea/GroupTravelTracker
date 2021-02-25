import React, {useState} from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Title from './Title';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import MenuOpenRoundedIcon from '@material-ui/icons/MenuOpenRounded';

import TripSummary from '../components/TripSummary';
import EventForm from '../components/EventForm';
import ItineraryOverview from '../components/ItineraryOverview';
import useStyles from '../style';


export default function Dashboard(props) {
    const classes = useStyles();
    const [ openCreateEvent, setOpenCreateEvent ] = useState(false);

    const handleClickOpen = () => {
      setOpenCreateEvent(true);
    };

    const handleClose = () => {
      setOpenCreateEvent(false);
    };

    return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* ItineraryOverview */}
            <Grid item xs={12} md={6} lg={6}>
                <Paper className={classes.fixedHeightPaperCenterAlign}>
                    <Grid container direction="row" justify="space-between">
                        <Grid item xs={2}>
                            <Title>Itinerary</Title>
                        </Grid>
                        <Grid item xs={2}>
                            {props.tripDetails && props.events.length > 0 ? 
                                (
                                    <Tooltip title="View full Itinerary">
                                        <IconButton aria-label="itinerary" onClick={props.selectItinerary}>
                                            <MenuOpenRoundedIcon/>
                                        </IconButton>
                                    </Tooltip>
                                ) : (
                                    <div></div>
                                )
                            }

                        </Grid>
                    </Grid>
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
                            <IconButton color="primary" aria-label="create event" onClick={handleClickOpen}>
                                <AddCircleIcon/>
                            </IconButton>
                        </Tooltip>
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
            <EventForm 
                open={openCreateEvent}
                handleClose={handleClose}
                token={props.token}
                trip={props.tripDetails}
                refetchEvents={props.refetchEvents}
            />
        </Container>
    )
}
          