import React, { useState } from 'react';
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {

});

function GoogleMapsContainer(props) {
  const [ showingInfoWindow, setShowingInfoWindow ] = useState(false);
  const [ activeMarker, setActiveMarker ] = useState({});
  const [ selectedPlace, setSelectedPlace ] = useState({});
  const classes = useStyles();

  // const onMarkerClick = (props, marker, e) => {
  //   setSelectedPlace(props);
  //   setActiveMarker(marker);
  //   setShowingInfoWindow(true);
  // }
  const onMapClick = () => {
      alert("something...")
  }

  return (
    <Map
      item
      xs = { 12 }
      style={{width: '20%', height: '40%', position: 'static'}}
      google = { props.google }
      onClick = { onMapClick }
      initialCenter = {{ lat: 39.648209, lng: -75.711185 }}
    >
      <Marker
        title = { 'Changing Colors Garage' }
        position = {{ lat: 39.648209, lng: -75.711185 }}
        name = { 'Changing Colors Garage' }
      />
      <InfoWindow
        marker = { activeMarker }
        visible = { showingInfoWindow }
      >
        <Paper>
          <Typography
            variant = 'headline'
            component = 'h4'
          >
            Changing Colors Garage
          </Typography>
          <Typography
            component = 'p'
          >
            98G Albe Dr Newark, DE 19702 <br />
            302-293-8627
          </Typography>
        </Paper>
      </InfoWindow>
    </Map>
  );
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyA6iG7LGNxxs_ZT6eIkTUWK1sCd9Xf6i9w")
})(GoogleMapsContainer)