import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';

// import SideBar from '../components/SideBar';
import useStyles from '../style';
import PropTypes from 'prop-types';
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import api from '../api';


const MapScreen = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const [ showingInfoWindow, setShowingInfoWindow ] = useState(true);
  const [ activeMarker, setActiveMarker ] = useState({});
  const [ lat, setLat ] = useState(39.648209);
  const [ lng, setLng ] = useState(-75.711185);
  const  [ hasError, setErrors ] =  useState(false);

  const onMapClick = () => {
    alert("navigate to the Map Screen")
  };

  async function fetchLatLng() {
    try {
        const res = await fetch(api.location.get(props.token, props.start_location));
        res.json()
        .then((res) => {
        setLat(res.results[0].geometry.location.lat);
        setLng(res.results[0].geometry.location.lng);
        })
    } catch (err) {
        setErrors(err)
    }};
    useEffect(() => {
        fetchLatLng();
    }, []);

    return (
        <div className={classes.secondaryRoot}>
        {/* <SideBar tripDetails={tripDetails}/> */}
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Map
                        item
                        xs = { 12 }
                        style={{ width: '20%', height: '25%', position: 'absolute', left: 0, top: 0 }}
                        google = { props.google }
                        onClick = { onMapClick }
                        center = {{ lat: lat, lng:  lng}}
                    >
                        <Marker
                        name = {props.start_location}
                        position = {{ lat: lat, lng: lng }}
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
                            {props.start_location}
                            </Typography>
                        </Paper>
                        </InfoWindow>
                    </Map>
                </Container>
            </main>
        </div>
    )
};



MapScreen.propTypes = {
    google: PropTypes.object,
    zoom: PropTypes.number,
    start_location: PropTypes.string,
  }
  MapScreen.defaultProps = {
    zoom: 13,
    start_location: 'United States'
  }
  
  export default GoogleApiWrapper(
    (props) => ({
      apiKey: props.apiKey,
      start_location: props.start_location,
    }
  ))(MapScreen);
