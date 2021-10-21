import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, TextField, Paper, Grid, Autocomplete, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import Delete from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
    useParams
  } from 'react-router-dom'
  import { useHistory } from 'react-router'

function EditPlaylist(props) {

    const baseUrl = 'http://localhost:8081';
    const [deletionConfirmOpen, setDeletionConfirmOpen] = useState(false)
    const playlistName = useParams().playlistName
    const [playlist, setPlaylist] = useState(playlistName ? null : {
        name: "",
        levels: []
    })

    const [allLevels, setAllLevels] = useState([])

    function deletePlaylist(){
        const url = `${baseUrl}/playlist/${playlistName}`
        axios.delete(url)
            .then(function (response) {
                back()
            }).catch(function (error) {
                // handle error
                console.log(error);
            })
    }
    function load(playlistName) {
        const url = `${baseUrl}/playlist/${playlistName}`
        axios.get(url)
            .then(function (response) {
                // handle success
                console.log('success');
                console.log(response.data);
                setPlaylist(response.data)
            }).catch(function (error) {
                // handle error
                console.log(error);
            })
    }
    const handleNameChange = (event) => {
        setPlaylist({
            ...playlist,
            name: event.target.value,
        })
    };
    const history = useHistory()

    function back() {
        history.goBack()
    }

    function createOrUpdate(){
        if (playlist.name.length > 0) {
            let url = `${baseUrl}/playlist`
            if(playlistName){
                url += `/${playlistName}`
            }
            axios.post(url, playlist)
                .then(function (response) {
                    back()
                })
        }
    }
    function loadLevels(){
        const baseUrl = 'http://localhost:8081';
        const url = `${baseUrl}/levels`
        axios.get(url)
            .then(function (response) {
                setAllLevels(response.data.map(l => l.name))
            }).catch(function (error) {
                console.log('Failed to load levels list:');
                console.log(error);
            })
    }

    useEffect(() => {
        if (playlistName) {
            load(playlistName)
        }
        loadLevels()
    }, [playlistName])
    
    return (playlist) ? <>
    <Dialog
        open={deletionConfirmOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            Confirm deletion of this playlist
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                The deletion of the level "{playlist.name}" can't be reverted. All the data will be lost.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setDeletionConfirmOpen(false)}>Back</Button>
            <Button onClick={deletePlaylist} autoFocus>
                Delete
            </Button>
        </DialogActions>
    </Dialog><Paper className='content'>
        <form onSubmit={(e) => {e.preventDefault(); createOrUpdate()}}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={1}>
                    <ArrowBackIcon style={{ cursor: 'pointer', float: 'left' }} onClick={() => back()} />
                </Grid>
                <Grid item xs={10} style={{textAlign:'center'}}>
        {!playlistName ? <h2>Create a playlist</h2> : <h2>Edit playlist "{playlist.name}"</h2>}
                </Grid>
                <Grid item xs={1}>
                    {playlistName ? <Delete onClick={() => setDeletionConfirmOpen(true)} style={{ cursor: "pointer", float: 'right' }} /> : <></>}
                </Grid>
                <Grid item xs={6}>
                    Name
                </Grid>
                <Grid item xs={6}>
                    <TextField value={playlist.name} onChange={handleNameChange} style={{ width: '100%' }} disabled={playlistName ? true : false} />
                </Grid>
                <Grid item xs={6}>
                    Levels
                </Grid>
                <Grid item xs={6}>
                <Autocomplete
                    multiple
                    id="tags-standard"
                    options={allLevels}
                    getOptionLabel={(option) => option}
                    value={playlist.levels}
                    onChange={(event, newValues) => {
                        setPlaylist({...playlist, levels: newValues})
                      }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Levels"
                        placeholder="Level to add"
                    />
                    )}
                />
                </Grid>
                <Grid item xs={12}>
                    <Button style={{float: 'right'}} variant='contained' type="submit">Save</Button>
                </Grid>
            </Grid>
        </form>
    </Paper></> : <>Loading</>
}

export default EditPlaylist;
