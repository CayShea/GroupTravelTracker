import React, { useState, useEffect } from 'react';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import NoteIcon from '@material-ui/icons/Note';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import useStyles from '../style';
import api from '../api';
import NoteAdd from '@material-ui/icons/NoteAdd';


function Note (props) {
    const classes = useStyles();

    return (
        <div>
            <Paper className={classes.itineraryRowToday}>
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    alignContent="center"
                >
                    <Grid item>{props.body}</Grid>
                    <Avatar className={classes.miniAvatar} alt={props.author_name} src={props.author_photo} />
                    { props.iOwnThis ? 
                        (
                            <Tooltip title="Delete Note">
                                <IconButton aria-label="Delete Note" onClick={() => props.onDelete(props.noteId)}>
                                    <DeleteIcon fontSize="small"/>
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <div></div>
                        )
                    }
                </Grid>
            </Paper>
        </div>
    )
};

function NoteEditor (props) {
    const [ text, setText ] = useState('');

    const handleNoteAdd = () => {
        props.onNoteAdd(text);
    };

    const handleTextChange = (event) => {
        setText(event.target.value)
    };

    return (
        <div>
            <TextField 
                placeholder="Add note..."
                rows={5}
                value={text}
                onChange={handleTextChange}
            />
            <Button variant="contained" style={{marginLeft: '8px'}} onClick={handleNoteAdd}>Add</Button>
        </div>
    )
};

function NotesGrid (props) {
    const rows = [];

    const deleteThis = (id) => {
        props.onNotesDelete(id)
    }

    props.notes.forEach((note, i) => {
        if (props.user_displayName === note.author_name) {
            rows.push(<Note body={note.body} author_name={note.author_name} noteId={note.id} author_photo={note.author_photo} iOwnThis={true} key={i} onDelete={deleteThis}/>)
        } else {
            rows.push(<Note body={note.body} author_name={note.author_name}  noteId={note.id} author_photo={note.author_photo} iOwnThis={false} key={i} onDelete={deleteThis}/>)
        }
    });

    return (
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {rows}
                </Grid>
            </Grid>
        </Container>
    )
};


export default function NotesPopup (props) {
    const classes = useStyles();
    const [ open, setOpen ] = useState(false);

    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
  
    async function handleNoteDelete (noteId) {
        try {
          const res = await fetch(api.notes.delete(props.token, noteId)).then(() => {props.refetchNotes()})
        } catch (err) {
          console.log("Getting an err >", err)
        }
    };
  
    async function handleNoteAdd (newNote) {
      try {
        const res = await fetch(api.notes.create(props.token, newNote, props.tripId));
        res.json()
        .then((res) => {
            props.refetchNotes();
        })
      } catch (err) {
        console.log("Getting an err >", err)
      }
    };

    return (
        <div className={classes.toolbarIcon}>
            <Tooltip title="Trip Notes">
                <IconButton color="inherit" aria-label="trip notes" onClick={handleOpen}>
                    <NoteIcon />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    { props.notes ? (
                        <NotesGrid user_displayName={props.user_displayName} notes={props.notes} onNotesDelete={handleNoteDelete}/>
                    ) : (
                        <div></div>
                    )}
                    <NoteEditor onNoteAdd={handleNoteAdd} className={classes.marginTopBottom}/>
                </DialogContent>
            </Dialog>
        </div>
    )
}
