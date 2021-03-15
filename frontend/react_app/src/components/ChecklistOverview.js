import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ListIcon from '@material-ui/icons/List';

import useStyles from '../style';
import ChecklistPopup from './ChecklistPopup';

const ChecklistItemRow = (props) => {
    const classes = useStyles();
    const localChecklistObj = props.checklistObj;

    const openSelected = () => {
        props.handleClickOpen(props.id, localChecklistObj)
    }

    return (
        <div>
            <Paper className={classes.itineraryRow}>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    className={classes.hoverCursor}
                    onClick={openSelected}
                >
                    <Grid item><ListIcon />  {props.title}</Grid>
                    <Grid item>{props.num}</Grid>
                </Grid>
            </Paper>
        </div>
    )
}

function ChecklistOverview(props) {
    const classes = useStyles();
    const checklists = props.checklists;
    const [ open, setOpen ] = useState(false);
    const [ selectedChecklist, setSelectedChecklist ] = useState({});
    const [ checklistItems, setChecklistItems ] = useState([]);
    const [ checklistId, setChecklistId ] = useState('')
    const rows = [];
    
    const handleClickOpen = (id, obj) => {
        setSelectedChecklist(obj);
        setChecklistItems(obj.items);
        setChecklistId(id);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    if (props.checklists) {
        checklists.forEach((value, i) => {
            rows.push(<ChecklistItemRow title={value.title} num={value.items.length} checklistObj={value} key={value.id} id={value.id} handleClickOpen={handleClickOpen} />)
        });
    };


    return (
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {rows}
                </Grid>
            </Grid>
            { selectedChecklist && checklistId ? (
                <ChecklistPopup
                    open={open} 
                    handleClose={handleClose} 
                    selectedChecklist={selectedChecklist}
                    checklistItems={checklistItems}
                    refetchChecklists={props.refetchChecklists} 
                    checklistId={checklistId} 
                    user_displayName={props.user_displayName}
                    tripMembers={props.tripMembers}
                    token={props.token}
                />
                ) : (
                    <div></div>
                )
            }
        </Container>
    )
}

export default ChecklistOverview;
