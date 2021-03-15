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
import ChecklistForm from '../components/ChecklistForm';
import ItineraryOverview from '../components/ItineraryOverview';
import ChecklistOverview from '../components/ChecklistOverview';
import Footer from "./Footer"
import useStyles from '../style';


export default function Dashboard(props) {
    const classes = useStyles();
    const tripDetails = props.tripDetails;
    const [ openCreateEvent, setOpenCreateEvent ] = useState(false);
    const [ openCreateChecklist, setOpenCreateChecklist ] = useState(false);

    const handleClickOpenEvent = () => {
      setOpenCreateEvent(true);
    };

    const handleCloseEvent = () => {
      setOpenCreateEvent(false);
    };

    const handleClickOpenChecklist = () => {
        setOpenCreateChecklist(true);
      };
  
    const handleCloseChecklist = () => {
        setOpenCreateChecklist(false);
    };

    return (
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        {/* ItineraryOverview */}
                        <Grid item xs={12} md={6} lg={6}>
                            <Paper className={classes.fixedHeightPaperCenterAlign}>
                                { props.events.length > 0 ? 
                                    (
                                            <Grid container direction="row" justify="space-between">
                                                <Grid item xs={2}>
                                                    <Title>Itinerary</Title>
                                                </Grid>
                                                <Grid item xs={2}>
                                                            <Tooltip title="View full Itinerary">
                                                                <IconButton aria-label="itinerary" onClick={props.selectItinerary}>
                                                                    <MenuOpenRoundedIcon/>
                                                                </IconButton>
                                                            </Tooltip>
                                                </Grid>
                                                <ItineraryOverview 
                                                    trip={tripDetails} 
                                                    events={props.events}
                                                    withinRangeOfToday={props.withinRangeOfToday}
                                                    todayEventsArray={props.todayEventsArray}
                                                    firstEventIndex={props.firstEventIndex}
                                                />
                                            </Grid>
                                    ) : (
                                            <Grid container direction="row" justify="space-between">
                                                <Grid item xs={2}>
                                                    <Title>Itinerary</Title>
                                                </Grid>
                                            </Grid>
                                    )
                                }
                                <Tooltip title="Add Event">
                                    <IconButton color="primary" aria-label="create event" onClick={handleClickOpenEvent}>
                                        <AddCircleIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Paper>
                        </Grid>
                        {/* */}
                        {/* <Grid item xs={12} md={6} lg={6}>
                            <Paper className={classes.fixedHeightPaperCenterAlign}>
                            <MapOverview start_location={tripDetails.start_location} apiKey={("AIzaSyA6iG7LGNxxs_ZT6eIkTUWK1sCd9Xf6i9w")}/>
                            </Paper>
                        </Grid> */}
                        {/* Checklist */}
                        <Grid item xs={12} md={6} lg={6}>
                            <Paper className={classes.fixedHeightPaperCenterAlign}>
                                <Grid container direction="row" justify="space-between">
                                    <Grid item xs={2}>
                                        <Title>Checklist</Title>
                                    </Grid>
                                </Grid>
                                <ChecklistOverview checklists={props.tripChecklist} refetchChecklists={props.refetchChecklists} user_displayName={props.user_displayName} token={props.token} tripMembers={props.tripDetails.members}/>
                                <div>
                                    <Tooltip title="New Checklist">
                                        <IconButton color="primary" aria-label="create checklist" onClick={handleClickOpenChecklist}>
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </Paper>
                        </Grid>
                        {/* TripSummary */}
                        <Grid item xs={12} >
                            <Paper className={classes.fixedHeightPaperLeftAlign}>
                                <TripSummary trip={tripDetails} tripMembers={props.tripMembers}/>
                            </Paper>
                        </Grid>
                        {/* Budget
                        <Grid item xs={12}>
                            <Paper className={classes.secondaryPaper}>
                                <BudgetOverview />
                            </Paper>
                        </Grid> */}
                    </Grid>
                    <EventForm 
                        open={openCreateEvent}
                        handleClose={handleCloseEvent}
                        token={props.token}
                        trip={tripDetails}
                        refetchEvents={props.refetchEvents}
                        defaultStartEventTime={props.defaultStartEventTime}
                        defaultEndEventTime={props.defaultEndEventTime}
                    />
                    <ChecklistForm
                        open={openCreateChecklist}
                        handleClose={handleCloseChecklist}
                        token={props.token}
                        trip={tripDetails}
                        refetchTrip={props.refetchTrip}
                        showCreateForm={true}
                    />
                    <Footer />
                    </Container>
    )
}
          