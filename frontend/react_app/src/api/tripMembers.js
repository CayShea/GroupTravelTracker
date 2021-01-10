import { API_SERVER } from '../settings.js';


export default {
    list(token, tripId){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request( `${API_SERVER}/api/trip_members/?trip_id=${tripId}`,
            {
                method: "GET",
                headers: header,
            }
        ))
    },
    detail(token, id){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request(`${API_SERVER}/api/trip_members/${id}`,
            {
                method: "GET",
                headers: header
            }
        ))
    },
    create(token, tripMembers, tripId){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request(`${API_SERVER}/api/trip_members/`,
            {
                method: "POST",
                headers: header,
                body: JSON.stringify({
                    "trip_id": tripId,
                    "display_name": tripMembers
                })
            }
        ))
    },
    update(token, tripMembers, tripId){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request(`${API_SERVER}/api/trip_members/`,
            {
                method: "PATCH",
                headers: header,
                body: JSON.stringify({
                    "trip_id": tripId,
                    "display_name": tripMembers
                })
            }
        ))
    },
    // delete(token, selected){
    //     const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
    //     return (
    //         new Request(`${API_SERVER}/api/trips/${selected}`,
    //         {
    //             method: "DELETE",
    //             headers: header
    //         }
    //     ))
    // },
}