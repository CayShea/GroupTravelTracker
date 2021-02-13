import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import api from '../api';
import SideBar from '../components/SideBar';
import useStyles from '../style';
import Dashboard from '../components/Dashboard';
import Calendar from '../components/Calendar';
import Map from '../components/Map';
import Itinerary from '../components/Itinerary';
import one from "../components/CustomIcons/one.svg";
import two from "../components/CustomIcons/two.svg";
import three from "../components/CustomIcons/three.svg";
import four from "../components/CustomIcons/four.svg";
import five from "../components/CustomIcons/five.svg";
import six from "../components/CustomIcons/six.svg";
import seven from "../components/CustomIcons/seven.svg";
import eight from "../components/CustomIcons/eight.svg";
import nine from "../components/CustomIcons/nine.svg";
import ten from "../components/CustomIcons/ten.svg";
import eleven from "../components/CustomIcons/eleven.svg";
import twelve from "../components/CustomIcons/twelve.svg";
import thirteen from "../components/CustomIcons/thirteen.svg";
import fourteen from "../components/CustomIcons/fourteen.svg";
import fifteen from "../components/CustomIcons/fifteen.svg";
import sixteen from "../components/CustomIcons/sixteen.svg";
import seventeen from "../components/CustomIcons/seventeen.svg";
import eighteen from "../components/CustomIcons/eighteen.svg";
import nineteen from "../components/CustomIcons/nineteen.svg";
import twenty from "../components/CustomIcons/twenty.svg";
import twentyone from "../components/CustomIcons/twentyone.svg";
import twentytwo from "../components/CustomIcons/twentytwo.svg";
import twentythree from "../components/CustomIcons/twentythree.svg";
import twentyfour from "../components/CustomIcons/twentyfour.svg";
import twentyfive from "../components/CustomIcons/twentyfive.svg";
import twentysix from "../components/CustomIcons/twentysix.svg";
import twentyseven from "../components/CustomIcons/twentyseven.svg";
import twentyeight from "../components/CustomIcons/twentyeight.svg";
import twentynine from "../components/CustomIcons/twentynine.svg";
import thirty from "../components/CustomIcons/thirty.svg";
import thirtyone from "../components/CustomIcons/thirtyone.svg";
import thirtytwo from "../components/CustomIcons/thirtytwo.svg";
import thirtythree from "../components/CustomIcons/thirtythree.svg";
import thirtyfour from "../components/CustomIcons/thirtyfour.svg";
import thirtyfive from "../components/CustomIcons/thirtyfive.svg";
import thirtysix from "../components/CustomIcons/thirtysix.svg";
import thirtyseven from "../components/CustomIcons/thirtyseven.svg";
import thirtyeight from "../components/CustomIcons/thirtyeight.svg";
import thirtynine from "../components/CustomIcons/thirtynine.svg";
import forty from "../components/CustomIcons/forty.svg";
import fortyone from "../components/CustomIcons/fortyone.svg";
import fortytwo from "../components/CustomIcons/fortytwo.svg";
import fortythree from "../components/CustomIcons/fortythree.svg";
import fortyfour from "../components/CustomIcons/fortyfour.svg";
import fortyfive from "../components/CustomIcons/fortyfive.svg";
import fortysix from "../components/CustomIcons/fortysix.svg";
import fortyseven from "../components/CustomIcons/fortyseven.svg";
import fortyeight from "../components/CustomIcons/fortyeight.svg";
import fortynine from "../components/CustomIcons/fortynine.svg";
import fifty from "../components/CustomIcons/fifty.svg";


export default function TripDetails(props) {
    const classes = useStyles();
    const API_KEY = `${process.env.REACT_APP_geocode}`;
    let { id } = useParams();
    const [ tripDetails, setTripDetails ] = useState({});
    const [ events, setEvents ] = useState([]);
    const [ eventsWithLocation, setEventsWithLocation ] = useState([]);
    const  [ hasError, setErrors ] =  useState(false);
    const [ componentShowing, setComponentShowing ] = useState('dashboard');
    const [ withinRangeOfToday, setWithinRangeOfToday ] = useState(false);
    const [ todayEventsArray, setTodayEventsArray ] = useState([]);
    const [ firstEventIndex, setFirstEventIndex ] = useState(0);

    const numberIconsArray = [
      one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty, twentyone, twentytwo, twentythree, twentyfour, twentyfive, twentysix, twentyseven, twentyeight, twentynine, thirty, thirtyone, thirtytwo, thirtythree, thirtyfour, thirtyfive, thirtysix, thirtyseven, thirtyeight, thirtynine, forty, fortyone, fortytwo, fortythree, fortyfour, fortyfive, fortysix, fortyseven, fortyeight, fortynine, fifty
    ];

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
        res.forEach((x, index) => {
          x['orderOfEvent'] = numberIconsArray[index];
        });
        let filteredEvents = res.filter(element => element.location);
        console.log("What is my response??.", filteredEvents)
        setEventsWithLocation(filteredEvents);
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
              eventsWithLocation={eventsWithLocation}
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
