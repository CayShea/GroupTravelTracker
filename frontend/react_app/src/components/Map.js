import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import useStyles from '../style';
import PropTypes from 'prop-types';
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import Paper from '@material-ui/core/Paper';


const MapScreen = (props) => {
  const classes = useStyles();
  const bounds = new props.google.maps.LatLngBounds();
  const [ showingInfoWindow, setShowingInfoWindow ] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [ selectedDate, setSelectedDate ] = useState('');
  const google = props.google;

  // const onMapClick = () => {
  //   alert("navigate to the Map Screen")
  // };

  const formatHour = (timeToFormat) => {
    const hourCheck = timeToFormat.slice(0,2);
    if (Number(hourCheck) > 12) {
        const convertHour = (Number(hourCheck) - 12).toString();
        timeToFormat = convertHour.concat(timeToFormat.slice(2,5)).concat(" PM");
    } else {
        timeToFormat = timeToFormat.concat(" AM");
    };
    return timeToFormat;
  };

    const setDateFormatForSelected = (event) => {
      const setDate = event.start.slice(5, 10);
      const startTime = formatHour(event.start.slice(11, 16));
      const endTime = formatHour(event.end.slice(11, 16));
      const endDate = event.end.slice(5, 10);
      let differentEndDate = '';
      if (setDate !== endDate) {
        differentEndDate = endDate;
      }

    const newString = `${setDate} from ${startTime} to ${differentEndDate} ${endTime}`;
      setSelectedDate(newString);
    };

    for (var i = 0; i < props.eventsWithLocation.length; i++) {
      let points = {};
      points.lat = Number(props.eventsWithLocation[i].location.lat);
      points.lng = Number(props.eventsWithLocation[i].location.lng);
      bounds.extend(points);
    }

    return (
        <div className={classes.secondaryRoot}>
          <Grid container direction="row" justify="flex-start" className={classes.gridContainer}>
              <Map
                  item
                  xs = { 12 }
                  style={{ width: '80%', height: '80%', left: -20, top: 0, position: 'relative'}}
                  google = { props.google }
                  initialCenter = {{ lat: props.location.lat, lng: props.location.lng}}
                  bounds={bounds}
              >
                { props.eventsWithLocation ? 
                  ( props.eventsWithLocation.map(element => (       
                      <Marker                 
                        key={element.id}
                        icon={{
                          url: element.orderOfEvent,
                          anchor: new google.maps.Point(32,32),
                          scaledSize: new google.maps.Size(37,37)
                        }}
                        position={{
                            lat: Number(element.location.lat),
                            lng: Number(element.location.lng)  
                        }}
                        onClick={() => {
                          setSelectedCenter(element);
                          setDateFormatForSelected(element);
                          setShowingInfoWindow(true);
                        }}
                        // onClick={() => {alert("Direction to here")}}
                      />
                  ))) : (<div></div>)
                }
                {selectedCenter && (
                  <InfoWindow
                      visible={showingInfoWindow}
                      onCloseClick={() => {
                        setSelectedCenter(null);
                      }}
                      position={{
                        lat: selectedCenter.location.lat,
                        lng: selectedCenter.location.lng
                      }}
                  >
                    <Paper>
                          <div>
                            <h3>{selectedCenter.title}</h3>
                            <h5>WHEN: {selectedDate}</h5>
                            <h5>WHERE: {selectedCenter.location.title}</h5>
                            <h5>GOING:  {selectedCenter.attendees}</h5>
                          </div>
                    </Paper>
                  </InfoWindow>
                )}               
              </Map>
          </Grid>
        </div>
    )
};



MapScreen.propTypes = {
    google: PropTypes.object,
    zoom: PropTypes.number,
    location: PropTypes.object
  }
  MapScreen.defaultProps = {
    zoom: 16,
    location: {
      title: 'Phoenix, AZ',
      lat: 33.4484,
      lng: 112.0740
    }
  }
  
  export default GoogleApiWrapper(
    (props) => ({
      apiKey: props.apiKey,
      locationTitle: props.location.title,
    }
  ))(MapScreen);
