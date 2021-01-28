
export default {
    get(location) {
        return (
            new Request(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.REACT_APP_geocode}`)
        )
    }
}