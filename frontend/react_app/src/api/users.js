import { API_SERVER } from '../settings.js';


export default {
    list(token){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request( `${API_SERVER}/api/users`,
            {
                method: "GET",
                headers: header,
            }
        ))
    },
    edit(token, values){
        const header = new Headers({'Authorization': `Token ${token}`});
        return (
            new Request(`${API_SERVER}/rest-auth/user/`,
            {
                method: "PATCH",
                headers: header,
                body: values
            }
        ))
    },
}