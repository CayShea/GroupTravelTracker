import { API_SERVER } from '../settings.js';


export default {
    list(token, trip_id, event_id){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        if (event_id) {
            return (
                new Request(`${API_SERVER}/api/checklists/?trip_id=${trip_id}/?event_id=${event_id}`,
                {
                    method: "GET",
                    headers: header
                }
            ))
        } else {
            return (
                new Request(`${API_SERVER}/api/checklists/?trip_id=${trip_id}`,
                {
                    method: "GET",
                    headers: header
                }
            ))
        }
    },
    create(token, checklistData){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request(`${API_SERVER}/api/checklists/`,
            {
                method: "POST",
                headers: header,
                body: JSON.stringify(checklistData)
            }
        ))
    },
    delete(token, selected){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request(`${API_SERVER}/api/checklists/${selected}`,
            {
                method: "DELETE",
                headers: header
            }
        ))
    },
    item_list(token, checklist_id){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request(`${API_SERVER}/api/checklist_items/?trip_id=${checklist_id}`,
            {
                method: "GET",
                headers: header
            }
        ))
    },
    item_create(token, checklistData){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request(`${API_SERVER}/api/checklist_items/`,
            {
                method: "POST",
                headers: header,
                body: JSON.stringify(checklistData)
            }
        ))
    },
    item_edit(token, id, values){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request(`${API_SERVER}/api/checklist_items/${id}`,
            {
                method: "PATCH",
                headers: header,
                body: JSON.stringify(values)
            }
        ))
    },
    item_delete(token, selected){
        const header = new Headers({'Authorization': `Token ${token}`, 'Content-Type': 'application/json'});
        return (
            new Request(`${API_SERVER}/api/checklist_items/${selected}`,
            {
                method: "DELETE",
                headers: header
            }
        ))
    },
}