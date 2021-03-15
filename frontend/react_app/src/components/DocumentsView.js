import React, {useState} from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import useStyles from '../style';
import Footer from "./Footer"
import api from '../api';
import DocumentForm from '../components/DocumentForm';


const DocumentDisplay = (props) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const selectedDocument = {
        name: props.element.name,
        isprivate: (props.element.isprivate).toString(),
        note: props.element.note,
        trip_id: props.tripId
    };

    const editSelected = () => {
        props.handleClickOpen(props.element.id, selectedDocument);
    };

    const deleteSelected = () => {
        props.deleteSelected(props.element.id)
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };


    return (
        <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.root}>
                <a href={props.element.filepath} rel="noopener noreferrer" className={classes.hrefDisplay} target="_blank">
                    <CardActionArea>   
                        <CardMedia
                            className={classes.docsPreview}
                            image={props.element.filepath}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {props.element.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {props.element.note}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </a>
                <CardActions disableSpacing>
                    { props.element.isprivate ? (
                        <Tooltip title="private">
                            <LockIcon color="primary" />
                        </Tooltip>
                    ): (
                        <Tooltip title="public">
                            <LockOpenIcon color="primary" />
                        </Tooltip>
                    )}
                    
                    <IconButton 
                        aria-label="settings"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                        className={classes.moreVerticalIcon}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={editSelected}>
                            <IconButton color="inherit" aria-label="edit document">
                                <EditIcon />
                            </IconButton>
                            Edit
                        </MenuItem>
                        <MenuItem onClick={deleteSelected}>
                            <IconButton aria-label="delete" color="primary">
                                <DeleteIcon fontSize="default" />
                            </IconButton>
                            Delete
                        </MenuItem>
                    </Menu>
                </CardActions>
            </Card>
        </Grid>
    )
}

const DocumentsView = (props) => {
    const documentDisplays = [];
    const documents = props.trip.documents;
    const [ open, setOpen ] = useState(false);
    const [ selectedDocument, setSelectedDocument ] = useState('');
    const [ values, setValues ] = useState({
        name: '',
        isprivate: '',
        note: '',
        trip_id: ''
    });
    const  [ hasError, setError ] =  useState(false);
    const classes = useStyles();

    
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickOpen = (id, doc) => {
      doc.note = doc.note ? doc.note : '';
      doc.name = doc.name ? doc.name : '';
      setValues(doc);
      setSelectedDocument(id);
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        let formData = new FormData();
        formData.append('name', values.name);
        formData.append("note", values.note);
        formData.append('isprivate', values.isprivate);
        formData.append('trip_id', values.trip_id);
        try {
            const res = await fetch(api.documents.edit(props.token, selectedDocument, formData));
            res.json()
            .then(() => {
                handleClose();
                props.refetchTrip();
            }
        )} catch (err) {
            setError(err);
      }
    };

    async function deleteSelected(id) {
        try {
            const res = await fetch(api.documents.delete(props.token, id)).then(() => {props.refetchTrip()})
        } catch (err) {
            setError(err);
        }
    };

    if (props.trip && props.trip.documents) {
        documents.forEach((element, i) => {
            documentDisplays.push(<DocumentDisplay element={element} key={i} tripId={props.trip.id} handleClickOpen={handleClickOpen} deleteSelected={deleteSelected}/>)
        });
    };


    return (
        <Container maxWidth="lg">
            <DocumentForm token={props.token} tripId={props.trip.id} refetchTrip={props.refetchTrip}/>
            <Grid container spacing={1}>
                <Grid container item xs={12} spacing={3}>
                    {documentDisplays}
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">  
                <form encType="multipart/form-data" className={classes.form} onSubmit={handleSubmit}>
                    <DialogTitle id="form-dialog-title">
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item sm={12}>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    label="Document Name"
                                    value={values.name}
                                    onChange={handleChange('name')}
                                    type="text"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item sm={12}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="note"
                                    label="Note"
                                    value={values.note}
                                    onChange={handleChange('note')}
                                    type="text"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item sm={12}>
                                <FormControl component="fieldset">
                                    <RadioGroup row aria-label="isprivate" name="isprivate" value={values.isprivate} onChange={handleChange('isprivate')}>
                                        <FormControlLabel value="true" control={<Radio />} label="Private" />
                                        <FormControlLabel value="false" control={<Radio />} label="Public" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={handleClose}
                            variant="contained"
                            className={classes.submit}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Update
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Footer />
        </Container>
    )
}

export default DocumentsView;