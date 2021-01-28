import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';

import useStyles from '../style';
import PropTypes from 'prop-types';
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import Paper from '@material-ui/core/Paper';


const MapScreen = (props) => {
  const classes = useStyles();
  const [ showingInfoWindow, setShowingInfoWindow ] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [ selectedDate, setSelectedDate ] = useState('');

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

    const eventsWithLocation = props.events.filter(element => 
      element.location
    );

    return (
        <div className={classes.secondaryRoot}>
          <Container maxWidth="lg" className={classes.container}>
              <Map
                  item
                  xs = { 12 }
                  style={{ width: '80%', height: '80%', left: 0, top: 0, position: 'relative'}}
                  google = { props.google }
                  initialCenter = {{ lat: props.location.lat, lng: props.location.lng}}
              >
                { eventsWithLocation ? 
                  ( eventsWithLocation.map(element => (         
                      <Marker                 
                        key={element.id}
                        position={{
                            lat: Number(element.location.lat),
                            lng: Number(element.location.lng)  
                        }}
                        onClick={() => {
                          setSelectedCenter(element);
                          setDateFormatForSelected(element);
                          setShowingInfoWindow(true);
                        }}
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
          </Container>
        </div>
    )
};



MapScreen.propTypes = {
    google: PropTypes.object,
    zoom: PropTypes.number,
    location: PropTypes.object
  }
  MapScreen.defaultProps = {
    zoom: 18,
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
