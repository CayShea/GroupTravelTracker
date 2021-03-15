import { API_SERVER } from '../settings.js';


export default {
    list(token, trip_id, event_id){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        if (event_id) {
            return (
                new Request(`${API_SERVER}/api/notes/?trip_id=${trip_id}/?event_id=${event_id}`,
                {
                    method: "GET",
                    headers: header
                }
            ))
        } else {
            return (
                new Request(`${API_SERVER}/api/notes/?trip_id=${trip_id}`,
                {
                    method: "GET",
                    headers: header
                }
            ))
        }
    },
    create(token, note, tripId, eventId){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        const values = {
            body: note,
            trip_id: tripId,
            event_id: eventId
        }
        return (
            new Request(`${API_SERVER}/api/notes/`,
            {
                method: "POST",
                headers: header,
                body: JSON.stringify(values)
            }
        ))
    },
    delete(token, selected){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request(`${API_SERVER}/api/notes/${selected}`,
            {
                method: "DELETE",
                headers: header
            }
        ))
    },
}