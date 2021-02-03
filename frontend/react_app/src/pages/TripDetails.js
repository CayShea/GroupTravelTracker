import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import api from '../api';
import SideBar from '../components/SideBar';
import useStyles from '../style';
import Dashboard from '../components/Dashboard';
import Calendar from '../components/Calendar';
import Map from '../components/Map';
import Itinerary from '../components/Itinerary';


export default function TripDetails(props) {
    const classes = useStyles();
    const API_KEY = `${process.env.REACT_APP_geocode}`;
    let { id } = useParams();
    const [ tripDetails, setTripDetails ] = useState({});
    const [ events, setEvents ] = useState([]);
    const  [ hasError, setErrors ] =  useState(false);
    const [ componentShowing, setComponentShowing ] = useState('dashboard');

    const [ withinRangeOfToday, setWithinRangeOfToday ] = useState(false);
    const [ todayEventsArray, setTodayEventsArray ] = useState([]);
    const [ firstEventIndex, setFirstEventIndex ] = useState(0);

    const formatItinerary = (trip) => {
      const tripStart = new Date(trip.startdate);
      const tripEnd = new Date(trip.enddate);
      const today = new Date();
      const todayDateString = today.toDateString()
  
      if (today.getTime() < tripEnd.getTime() && today.getTime() > tripStart.getTime()) {
          today.setDate(today.getDate() - 1);
          const firstEvent = events.find(event => new Date(event.start).getTime() >= today.getTime())
          setFirstEventIndex(events.indexOf(firstEvent));
          setWithinRangeOfToday(true);
      }

      setTodayEventsArray(events.filter(element =>  new Date(element.start).toDateString() === todayDateString));
    };

    async function fetchTrip() {
      const res = await fetch(api.trips.detail(props.token, id));
      res.json()
      .then(res => {
        setTripDetails(res);
        formatItinerary(res);
      })
      .catch(err => setErrors(err));
    };
    useEffect(() => {
      fetchTrip();
    }, []);

    async function fetchEvents() {
      const res = await fetch(api.events.list(props.token, id));
      res.json()
      .then(res => {
        setEvents(res);
      })
      .catch(err => setErrors(err));
    };
    useEffect(() => {
      fetchEvents();
    }, []);

    const selectCalendar = () => {
      setComponentShowing('calendar');
    };
    const selectMap = () => {
      setComponentShowing('map');
    };
    const selectItinerary = () => {
      setComponentShowing('itinerary');
    };
    const selectDashboard = () => {
      setComponentShowing('dashboard');
    };

    function RenderSwitch(props) {
      switch(props.value) {
        case 'calendar':
          return (
            <Calendar 
              tripDetails={tripDetails} 
              token={props.token} 
              events={events} 
              refetchTrip={fetchTrip}
              refetchEvents={fetchEvents}
            ></Calendar>
          )
        case 'map':
          return (
            <Map 
              tripDetails={tripDetails} 
              location={tripDetails.location} 
              events={events} 
              apiKey={API_KEY}
            ></Map>
          )
        case 'itinerary':
            return (
            <Itinerary 
              trip={tripDetails} 
              events={events}
              withinRangeOfToday={withinRangeOfToday}
              todayEventsArray={todayEventsArray}
              firstEventIndex={firstEventIndex}
            ></Itinerary>
          )
        default:
          return (
            <Dashboard 
              tripDetails={tripDetails} 
              events={events}
              withinRangeOfToday={withinRangeOfToday}
              todayEventsArray={todayEventsArray}
              firstEventIndex={firstEventIndex}
              selectItinerary={selectItinerary}
            ></Dashboard>
          );
      }
    }

    return (
      <div className={classes.secondaryRoot}>
        <SideBar 
          tripDetails={tripDetails}
          events={events}
          selectDashboard={selectDashboard}
          selectCalendar={selectCalendar}
          selectMap={selectMap}
          selectItinerary={selectItinerary}
          isDashboardView={true} 
          fetchData={fetchTrip} 
          token={props.token}
        />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
            <RenderSwitch value={componentShowing} token={props.token}/>
        </main>
      </div>
    );
}
