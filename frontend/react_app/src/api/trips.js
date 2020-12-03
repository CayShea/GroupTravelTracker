import { API_SERVER } from '../settings.js';


export default {
    list(token){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request( `${API_SERVER}/api/trips`,
            {
                method: "GET",
                headers: header,
            }
        ))
    },
    create(token, values){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request(`${API_SERVER}/api/trips/`,
            {
                method: "POST",
                headers: header,
                body: JSON.stringify(values)
            }
        ))
    },
    detail(token, id){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request(`${API_SERVER}/api/trips/${id}`,
            {
                method: "GET",
                headers: header
            }
        ))
    },
    delete(token, selected){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request(`${API_SERVER}/api/trips/${selected}`,
            {
                method: "DELETE",
                headers: header
            }
        ))
    },
}