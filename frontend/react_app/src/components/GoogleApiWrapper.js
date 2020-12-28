import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';

import GoogleMapsContainer from './MapOverview';

export default GoogleApiWrapper({
    apiKey: ("AIzaSyA6iG7LGNxxs_ZT6eIkTUWK1sCd9Xf6i9w")
})(GoogleMapsContainer);