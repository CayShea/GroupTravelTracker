import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import useStyles from '../style';
import api from '../api';


const DocumentForm = (props) => {
    const classes = useStyles();
    const [ open, setOpen ] = useState(false);
    const  [ hasError, setError ] =  useState(false);
    const [ filepath, setFilepath ] = useState('');
    const [ fileError, setFileError ] = useState(false);
    const [ values, setValues ] = useState({
        name: '',
        isprivate: 'false',
        note: '',
    });

    
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleFileUpload = (event) => {
        var file = event.target.files[0];
        setFilepath(file);
    };

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (!filepath) {
            setFileError(true);
        } else {
            let formData = new FormData();
            formData.append('filepath', filepath);
            formData.append('name', values.name);
            formData.append('isprivate', values.isprivate);
            formData.append('note', values.note);
            formData.append('trip_id', props.tripId);
            try {
              const res = await fetch(api.documents.create(props.token, formData));
              res.json()
              .then((res) => {
                  handleClose();
                //   props.reloadScreen();
              })
            } catch (err) {
              setError(err)
            }
        }
    }

    return (
        <div className={classes.root}>
            <Tooltip title="Add Document">
                <IconButton aria-label="add new document" onClick={handleClickOpen}>
                    <AddCircleIcon fontSize="large"/>
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <form encType="multipart/form-data" className={classes.form} onSubmit={handleSubmit}>
                    <DialogTitle id="form-dialog-title">Upload Document</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item sm={12}>
                                { fileError ? (
                                    <input
                                        error
                                        helperText="Required"
                                        id="contained-button-file"
                                        type="file"
                                        onChange={handleFileUpload}
                                        required
                                    />
                                ) : (
                                    <input
                                        id="contained-button-file"
                                        type="file"
                                        onChange={handleFileUpload}
                                        required
                                    />
                                )}
                            </Grid>
                            <Grid item sm={12}>
                                <FormControl component="fieldset">
                                    <RadioGroup row aria-label="isprivate" name="isprivate" value={values.isprivate} onChange={handleChange('isprivate')}>
                                        <FormControlLabel value="true" control={<Radio />} label="Private" />
                                        <FormControlLabel value="false" control={<Radio />} label="Public" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item sm={12}>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    label="Document Name (optional)"
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
                                    label="Note (optional)"
                                    value={values.note}
                                    onChange={handleChange('note')}
                                    type="text"
                                    fullWidth
                                />
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
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Create
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}

export default DocumentForm