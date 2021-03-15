import React, { useState, useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

import useStyles from '../style';
import api from '../api';
import TravelerDropdown from '../components/TravelerDropdown';


function ChecklistItem (props) {
    const classes = useStyles();
    const [ clickSetAssigned, setClickSetAssigned ] = useState(false);
    const resettingRef = useRef(false);
    const [ updateChecklistItem, setUpdateChecklistItem ] = useState({
        checklist_id: props.checklistId,
        is_done: props.isDone,
        assigned_to_name: props.assigned_to_name
    });


    const handleSetAssigned = () => {
        setClickSetAssigned(true);
    };

    const handleUpdateAssigned = (value) => {
        setUpdateChecklistItem({ ...updateChecklistItem, ['assigned_to_name']: value});
        resettingRef.current = true;
    };

    const handleChange = (event) => {
        setUpdateChecklistItem({ ...updateChecklistItem, ['is_done']: event.target.checked});
        resettingRef.current = true;
    };

    const updateItem = () => {
        props.onUpdateItem(props.itemId, updateChecklistItem)
    };

    useEffect(() => {
      if(resettingRef.current){
        resettingRef.current = false;
        updateItem();
      }
    },[updateChecklistItem])

    return (
        <div>
            <Paper className={classes.checklistRow}>
                <Grid
                    container
                    direction="row"
                    alignContent="center"
                    alignItems="center"
                    justify="space-between"
                >
                    <Grid item xs={1}>
                        <Checkbox
                            checked={updateChecklistItem.is_done}
                            onChange={handleChange}
                            color="default"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    </Grid>
                    <Grid item xs={6}>{props.text}</Grid>
                    { clickSetAssigned ? 
                        (
                            props.assigned_to_name ? (
                                <Grid item xs={5}>
                                    <TravelerDropdown
                                        travelerOptions={props.tripMembers}
                                        setAssigned={handleUpdateAssigned}
                                        initialValue={{"display_name": props.assigned_to_name}}
                                    />
                                </Grid>
                            ) : (
                                <Grid item xs={5}>
                                    <TravelerDropdown
                                        travelerOptions={props.tripMembers}
                                        setAssigned={handleUpdateAssigned}
                                    />
                                </Grid>
                            )
                        ) : (
                            <Grid item xs={3}>
                                { props.assigned_to_name ? 
                                    (
                                        <Tooltip title={props.assigned_to_name}>
                                            <IconButton color="default" aria-label="assign" onClick={handleSetAssigned}>
                                                <Avatar src={props.assigned_to_photo} alt={props.assigned_to_name} fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Assign to...">
                                            <IconButton color="default" aria-label="assign" onClick={handleSetAssigned}>
                                                <Badge badgeContent="+" color="primary" overlap="circle">
                                                    <AccountCircleIcon fontSize="inherit"/>
                                                </Badge>
                                            </IconButton>
                                        </Tooltip>
                                    )
                                }
                                { props.iOwnThis ? 
                                    (
                                        <Tooltip title="Delete ChecklistItem">
                                            <IconButton aria-label="Delete ChecklistItem" onClick={() => props.onDelete(props.itemId)}>
                                                x
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <div></div>
                                    )
                                }
                            </Grid>
                        )
                    }
                </Grid>
            </Paper>
        </div>
    )
};

function ItemEditor (props) {
    const [ checklistItem, setChecklistItem ] = useState({
        checklist_id: props.checklistId,
        text: ''
    });

    const handleChecklistItemAdd = () => {
        props.onChecklistAdd(checklistItem);
    };

    const handleTextChange = (event) => {
        setChecklistItem({ ...checklistItem, ['text']: event.target.value })
    };

    return (
        <div>
            <TextField 
                placeholder="Add to checklist..."
                rows={5}
                value={checklistItem.text}
                onChange={handleTextChange}
            />
            <Button variant="contained" style={{marginLeft: '8px'}} onClick={handleChecklistItemAdd}>Add</Button>
        </div>
    )
};

function ItemGrid (props) {
    const rows = [];

    const deleteThis = (id) => {
        props.onItemDelete(id)
    };

    const updateItem = (itemId, obj) => {
        props.onItemUpdate(itemId, obj)
    };

    props.items.forEach((item, i) => {
        if (props.user_displayName === item.author_name) {
            rows.push(<ChecklistItem 
                            text={item.text} 
                            isDone={item.is_done} 
                            assigned_to_photo={item.assigned_to_photo} 
                            assigned_to_name={item.assigned_to_name} 
                            tripMembers={props.tripMembers} 
                            checklistId={props.checklistId} 
                            itemId={item.id} 
                            iOwnThis={true} 
                            onDelete={deleteThis}
                            onUpdateItem={updateItem}
                            key={i} 
                        />)
        } else {
            rows.push(<ChecklistItem 
                            text={item.text} 
                            isDone={item.is_done} 
                            assigned_to_photo={item.assigned_to_photo} 
                            assigned_to_name={item.assigned_to_name} 
                            tripMembers={props.tripMembers} 
                            checklistId={props.checklistId} 
                            itemId={item.id} 
                            iOwnThis={false} 
                            onDelete={deleteThis}
                            onUpdateItem={updateItem}
                            key={i} 
                        />)
        }
    });

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                {rows}
            </Grid>
        </Grid>
    )
};

function ChecklistPopup (props) {
    const classes = useStyles();
    const selectedChecklist = props.selectedChecklist;
    const [ items, setItems ] = useState(props.checklistItems)
  
    async function handleChecklistItemDelete (checklistId) {
        try {
            const res = await fetch(api.checklist.item_delete(props.token, checklistId))
            .then(() =>  {
                return fetch(api.checklist.item_list(props.token, selectedChecklist.id))
            }).then((res2) => {
                if (res2.ok) {
                    return res2.json();
                } else {
                    return Promise.reject(res2);
                }
            }).then(function (res2) {
                setItems(res2)
            })
        } catch (err) {
          console.log("Getting an err >", err)
        }
    };
  
    async function handleChecklistItemUpdate (itemId, itemObj) {
        try {
            const res = await fetch(api.checklist.item_edit(props.token, itemId, itemObj))
            .then(() =>  {
                return fetch(api.checklist.item_list(props.token, selectedChecklist.id))
            }).then((res2) => {
                if (res2.ok) {
                    return res2.json();
                } else {
                    return Promise.reject(res2);
                }
            }).then(function (res2) {
                setItems(res2)
            })
        } catch (err) {
          console.log("Getting an err >", err)
        }
    };
  
    async function handleChecklistAdd (newChecklist) {
      try {
        const res = await fetch(api.checklist.item_create(props.token, newChecklist))
        res.json()
        .then((res) => {
            return fetch(api.checklist.item_list(props.token, selectedChecklist.id))
        }).then((res2) => {
            if (res2.ok) {
                return res2.json();
            } else {
                return Promise.reject(res2);
            }
        }).then(function (res2) {
            setItems(res2)
        })
      } catch (err) {
        console.log("Getting an err >", err)
      }
    };

    const handleClose = () => {
        props.refetchChecklists()
        props.handleClose()
    }

    return (
        <Container maxWidth="lg">
            <Dialog open={props.open} onClose={handleClose}>
                <DialogTitle id="form-dialog-title">
                    {selectedChecklist.title}
                </DialogTitle>
                <DialogContent>
                    { items ? (
                        <ItemGrid
                            user_displayName={props.user_displayName} 
                            items={items} 
                            onItemDelete={handleChecklistItemDelete}
                            onItemUpdate={handleChecklistItemUpdate}
                            tripMembers={props.tripMembers}
                            checklistId={selectedChecklist.id} 
                        />
                    ) : (
                        <div></div>
                    )}
                    </DialogContent>
                    <DialogActions>
                        <ItemEditor onChecklistAdd={handleChecklistAdd} checklistId={selectedChecklist.id} className={classes.marginTopBottom}/>
                    </DialogActions>
            </Dialog>
        </Container>
    )
};

export default ChecklistPopup;