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
    let { id } = useParams()
    const [ tripDetails, setTripDetails ] = useState({});
    const  [ hasError, setErrors ] =  useState(false);
    const [ componentShowing, setComponentShowing ] = useState('dashboard');

    async function fetchTrip() {
      const res = await fetch(api.trips.detail(props.token, id));
      res.json()
      .then(res => {
        console.log("THE TRIP DETAILS >>>>>>>>>", res)
        setTripDetails(res);
      })
      .catch(err => setErrors(err));
    };
    useEffect(() => {
      fetchTrip();
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
            <Calendar tripDetails={tripDetails} token={props.token} refetchTrip={fetchTrip}></Calendar>
          )
        case 'map':
            return (
              <Map tripDetails={tripDetails} start_location={tripDetails.start_location} apiKey="AIzaSyC7wcXFUcRT2BLoQPiFdBDjApYiZHIPyJs"></Map>
            )
        case 'dashboard':
          return (
            <Dashboard tripDetails={tripDetails}></Dashboard>
          );
        default:
          return null;
      }
    }

    return (
      <div className={classes.secondaryRoot}>
        <SideBar 
          tripDetails={tripDetails}
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
