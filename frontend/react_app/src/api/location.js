
const API_KEY = "AIzaSyA6iG7LGNxxs_ZT6eIkTUWK1sCd9Xf6i9w"

export default {
    get(location) {
        return (
            new Request(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${API_KEY}`)
        )
    }
}
// =1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY