import { useCallback, useEffect, useState } from 'react';
import LevelDesign from './LevelDesign'
import { Button, TextField, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import axios from 'axios'
import { useHistory } from 'react-router'
import Delete from '@mui/icons-material/Delete'
import MyDropzone from './ImageDropZone'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import uploadTmpFile from './uploadTmpFile'
import config from '../config';

const baseUrl = config.baseApiUrl
const worldSize = {width: 22, height:10}


function BasicForm(props) {
    const [deletionConfirmOpen, setDeletionConfirmOpen] = useState(false)
    const [level, setLevel] = useState(props.level ?? {
        name: "",
        pieces: [],
        size:worldSize,
        background: null,
    });

    const onLevelChanged = useCallback((levelUpdated) => {
        setLevel({...level, ...levelUpdated})
    }, [])

    const handleNameChange = (event) => {
        setLevel({
            ...level,
            name: event.target.value,
        })
    };

    const history = useHistory()

    function back() {
        history.goBack()
    }

    function create(event) {
        event.preventDefault()
        if (level.name.length > 0 && level.pieces != null) {
            const url = `${baseUrl}/level`
            axios.post(url, level)
                .then(function (response) {
                    back()
                })
        }
    }
    function deleteLevel() {
        const baseUrl = config.baseApiUrl
        const url = `${baseUrl}/delete?level=${level.name}`
        axios.delete(url)
            .then(function (response) {
                back()
            })
    }

    return <>
    <Dialog
        open={deletionConfirmOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {"Confirm deletion of this level"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                The deletion of the level "{level.name}" can't be reverted. All the data will be lost.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setDeletionConfirmOpen(false)}>Back</Button>
            <Button onClick={deleteLevel} autoFocus>
                Delete
            </Button>
        </DialogActions>
    </Dialog>
    <Paper className='designer' xs={6}>
        <form onSubmit={create}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={1}>
                    <ArrowBackIcon style={{ cursor: 'pointer', float: 'left' }} onClick={() => back()} />
                </Grid>
                <Grid item xs={10} style={{textAlign:'center'}}>
                    {!props.level ? <h2>Create a level</h2> : <h2>Edit level "{level.name}"</h2>}
                </Grid>
                <Grid item xs={1}>
                    {props.level ? <Delete onClick={() => setDeletionConfirmOpen(true)} style={{ cursor: "pointer", float: 'right' }} /> : <></>}
                </Grid>
                <Grid item xs={6}>
                    Name
                </Grid>
                <Grid item xs={6}>
                    <TextField value={level.name} onChange={handleNameChange} style={{ width: '100%' }} disabled={props.level ? true : false} />
                </Grid>
                <Grid item xs={12}>
                    <LevelDesign level={level} levelChanged={onLevelChanged} />
                </Grid>
                <Grid item xs={12}>
                    <Button style={{float: 'right'}} variant='contained' type="submit">Save</Button>
                </Grid>

            </Grid>
        </form>
    </Paper></>
}

export default BasicForm;
