import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import api from '../api';
import SideBar from '../components/SideBar';
import useStyles from '../style';
import Dashboard from '../components/Dashboard';
import Calendar from '../components/Calendar';
import Map from '../components/Map';


export default function TripDetails(props) {
    const classes = useStyles();
    const API_KEY = `${process.env.REACT_APP_geocode}`;
    let { id } = useParams();
    const [ tripDetails, setTripDetails ] = useState({});
    const [ events, setEvents ] = useState([]);
    const  [ hasError, setErrors ] =  useState(false);
    const [ componentShowing, setComponentShowing ] = useState('dashboard');

    async function fetchTrip() {
      const res = await fetch(api.trips.detail(props.token, id));
      res.json()
      .then(res => {
        setTripDetails(res);
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
    const selectDashboard = () => {
      setComponentShowing('dashboard');
    };

    function RenderSwitch(props) {
      switch(props.value) {
        case 'calendar':
          return (
            <Calendar tripDetails={tripDetails} token={props.token} events={events} refetchTrip={fetchTrip}></Calendar>
          )
        case 'map':
            return (
            <Map tripDetails={tripDetails} location={tripDetails.location} events={events} apiKey={API_KEY}></Map>
            )
        case 'dashboard':
          return (
            <Dashboard tripDetails={tripDetails} events={events}></Dashboard>
          );
        default:
          return null;
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
