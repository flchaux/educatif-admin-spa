import { Button, TextField, Slider, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { useState } from 'react'
import axios from 'axios'
import MyDropzone from './ImageDropZone'
import { useHistory } from 'react-router'
import Delete from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const baseUrl = 'http://localhost:8081';

function PuzzleForm(props) {

    let levelLoaded
    if(props.level){
        levelLoaded = {
            width: parseInt(props.level.specs.size.width),
            height: parseInt(props.level.specs.size.height),
            name: props.level.name,
            file: baseUrl+'/level/'+props.level.name+"/src.png"
        }
    }
    
    const [deletionConfirmOpen, setDeletionConfirmOpen] = useState(false)
    const [fileUrl, setFileUrl] = useState(levelLoaded?.file)
    const [level, setLevel] = useState(levelLoaded ?? {
        width: 4,
        height: 4,
        name: "",
        file: null
    })

    const handleSliderWidthChange = (event, newValue) => {
        setLevel({
            ...level,
            width: newValue,
        })
    };
    const handleSliderHeightChange = (event, newValue) => {
        setLevel({
            ...level,
            height: newValue,
        })
    };
    const handleNameChange = (event) => {
        setLevel({
            ...level,
            name: event.target.value,
        })
    };

    const handleDropImage = (files) => {
        setLevel({
            ...level,
            file: files[0],
        })
        setFileUrl(URL.createObjectURL(files[0]))
    }

    const history = useHistory()
    function back() {

        history.goBack()
    }

    function create(event) {
        event.preventDefault();
        if (level.name.length > 0 && level.file != null) {
            const baseUrl = 'http://localhost:8081';
            var formData = new FormData();
            formData.append("image", level.file);
            const url = `${baseUrl}/generate/puzzle?level=${level.name}&width=${level.width}&height=${level.height}`
            console.log(url)
            axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(function (response) {
                    back()
                })
        }
    }

    function deleteLevel() {
        const baseUrl = 'http://localhost:8081';
        const url = `${baseUrl}/delete?level=${level.name}`
        console.log(url)
        axios.delete(url)
            .then(function (response) {
                back()
            })
    }

    return (
        <div>
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
            <Paper style={{ margin: 'auto', minWidth: 400, maxWidth: 800, padding: 10 }} xs={6}>
                <ArrowBackIcon style={{cursor: 'pointer', float: 'left'}} onClick={() => back()} />
                {props.level ? 
                    <Delete onClick={() => setDeletionConfirmOpen(true)} style={{ cursor: "pointer", float: 'right' }} /> : <></>}
                {!props.level ? <h2>Create a puzzle</h2> : <h2>See puzzle "{level.name}"</h2>}
                <form onSubmit={create}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            Name
                        </Grid>
                        <Grid item xs={6}>
                            <TextField value={level.name} onChange={handleNameChange} style={{ width: '100%' }} disabled={props.level ? true : false} />
                        </Grid>
                        <Grid item xs={6}>
                            Width
                        </Grid>
                        <Grid item xs={6}>
                            <Slider min={2} max={8} marks valueLabelDisplay="on" aria-label="Width" disabled={props.level ? true : false} value={level.width} onChange={handleSliderWidthChange} />
                        </Grid>
                        <Grid item xs={6}>
                            Height
                        </Grid>
                        <Grid item xs={6}>
                            <Slider min={2} max={8} marks valueLabelDisplay="on" aria-label="Height" disabled={props.level ? true : false} value={level.height} onChange={handleSliderHeightChange} />
                        </Grid>
                        <Grid item xs={6}>
                            Image
                        </Grid>
                        <Grid item xs={6}>
                            <MyDropzone onChange={handleDropImage} disabled={props.level ? true : false} file={fileUrl}></MyDropzone>
                        </Grid>
                        <Grid item xs={10}>
                            {!props.level ?  <Button type="submit">Create</Button> : <></>}
                        </Grid>

                    </Grid>
                </form>
            </Paper>
        </div>
    );
}

export default PuzzleForm;
