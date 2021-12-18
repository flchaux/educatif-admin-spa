import { Button, TextField, Slider, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { useMemo, useState } from 'react'
import axios from 'axios'
import MyDropzone from './ImageDropZone'
import { useHistory } from 'react-router'
import Delete from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import config from '../config'

const baseUrl = config.baseApiUrl
const backgroundSize = {width: 22, height: 10}

function PuzzleForm(props) {

    let levelLoaded
    if(props.level){
        levelLoaded = {
            width: parseInt(props.level.specs.size.width),
            height: parseInt(props.level.specs.size.height),
            name: props.level.name,
            image: baseUrl+'/level/'+props.level.name+"/src.png",
            background: baseUrl+'/level/'+props.level.name+"/background.png"
        }
    }
    
    const [deletionConfirmOpen, setDeletionConfirmOpen] = useState(false)
    const [imageUrl, setImageUrl] = useState(levelLoaded?.image)
    const [backgroundUrl, setBackgroundUrl] = useState(levelLoaded?.background)
    const [level, setLevel] = useState(levelLoaded ?? {
        width: 4,
        height: 4,
        name: "",
        background: null,
        image: null
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
            image: files[0],
        })
        setImageUrl(URL.createObjectURL(files[0]))
    }

    const handleDropBackground = (files) => {
        setLevel({
            ...level,
            background: files[0],
        })
        setBackgroundUrl(URL.createObjectURL(files[0]))
    }

    const history = useHistory()
    function back() {

        history.goBack()
    }


    function create() {
        if (level.name.length > 0 && level.image != null) {
            var formData = new FormData();
            formData.append("image", level.image);
            formData.append("background", level.background);
            const url = `${baseUrl}/generate/puzzle?level=${level.name}&width=${level.width}&height=${level.height}`
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

    function update(){
        if (level.name.length > 0 && level.image != null) {
            var formData = new FormData();
            if(backgroundUrl !== levelLoaded.background){
                formData.append("background", level.background);
            }
            if(imageUrl !== levelLoaded.image){
                formData.append("image", level.image);
            }
            const url = `${baseUrl}/generate/puzzle?level=${level.name}&width=${level.width}&height=${level.height}`
            axios.patch(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(function (response) {
                    back()
                })
        }
    }

    function submit(event){
        event.preventDefault();
        if(props.level){
            update()
        }
        else{
            create()
        }
    }

    function deleteLevel() {
        const url = `${baseUrl}/delete?level=${level.name}`
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
            <Paper className='content'>
                <form onSubmit={submit}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={1}>
                            <ArrowBackIcon style={{ cursor: 'pointer', float: 'left' }} onClick={() => back()} />
                        </Grid>
                        <Grid item xs={10} style={{textAlign:'center'}}>
                            {!props.level ? <h2>Create a puzzle</h2> : <h2>Edit puzzle "{level.name}"</h2>}
                        </Grid>
                        <Grid item xs={1}>
                            {props.level ? <Delete onClick={() => setDeletionConfirmOpen(true)} style={{ cursor: "pointer", float: 'right' }} /> : <></>}
                        </Grid>
                        <Grid item xs={4}>
                            Name
                        </Grid>
                        <Grid item xs={8}>
                            <TextField value={level.name} onChange={handleNameChange} style={{ width: '100%' }} disabled={props.level ? true : false} />
                        </Grid>
                        <Grid item xs={4}>
                            Width
                        </Grid>
                        <Grid item xs={8}>
                            <Slider min={2} max={8} marks valueLabelDisplay="on" aria-label="Width" value={level.width} onChange={handleSliderWidthChange} />
                        </Grid>
                        <Grid item xs={4}>
                            Height
                        </Grid>
                        <Grid item xs={8}>
                            <Slider min={2} max={8} marks valueLabelDisplay="on" aria-label="Height" value={level.height} onChange={handleSliderHeightChange} />
                        </Grid>
                        <Grid item xs={4}>
                            Image
                        </Grid>
                        <Grid item xs={8}>
                            <MyDropzone onChange={handleDropImage} style={{width: 300, height: 300}} file={imageUrl}></MyDropzone>
                        </Grid>
                        <Grid item xs={4}>
                            Background
                        </Grid>
                        <Grid item xs={8}>
                            <MyDropzone onChange={handleDropBackground} style={{width: 200*backgroundSize.width/backgroundSize.height, height: 200}} disabled={props.level ? true : false} file={backgroundUrl}></MyDropzone>
                        </Grid>
                        <Grid item xs={12}>
                            <Button style={{float: 'right'}} variant='contained' type="submit">Save</Button>
                        </Grid>

                    </Grid>
                </form>
            </Paper>
        </div>
    );
}

export default PuzzleForm;
