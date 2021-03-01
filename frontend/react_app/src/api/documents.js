import { API_SERVER } from '../settings.js';


export default {
    create(token, values){
        const header = new Headers({'Authorization': `Token ${token}`});
        return (
            new Request(`${API_SERVER}/api/traveldocs/`,
            {
                method: "POST",
                headers: header,
                body: values
            }
        ))
    },
    edit(token, id, values){
        const header = new Headers({'Authorization': `Token ${token}`});
        return (
            new Request(`${API_SERVER}/api/traveldocs/${id}`,
            {
                method: "PATCH",
                headers: header,
                body: values
            }
        ))
    },
    delete(token, selected){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request(`${API_SERVER}/api/traveldocs/${selected}`,
            {
                method: "DELETE",
                headers: header
            }
        ))
    },
}