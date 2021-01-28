import { API_SERVER } from '../settings.js';


export default {
    list(token, trip_id){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request( `${API_SERVER}/api/events/?trip_id=${trip_id}`,
            {
                method: "GET",
                headers: header,
            }
        ))
    },
    create(token, values){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        console.log("THE values....", values)
        return (
            new Request(`${API_SERVER}/api/events/`,
            {
                method: "POST",
                headers: header,
                body: JSON.stringify(values)
            }
        ))
    },
    edit(token, values, id){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request(`${API_SERVER}/api/events/${id}`,
            {
                method: "PATCH",
                headers: header,
                body: JSON.stringify(values)
            }
        ))
    },
    delete(token, selected){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request(`${API_SERVER}/api/events/${selected}`,
            {
                method: "DELETE",
                headers: header
            }
        ))
    },
}