import { Paper, Button, List, ListItem, ListItemButton } from '@mui/material'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import config from './config';

function PlaylistList() {

    function load() {
        const baseUrl = config.baseApiUrl
        const url = `${baseUrl}/playlist`
        axios.get(url)
            .then(function (response) {
                // handle success
                setPlaylists(response.data)
            }).catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    let [playlists, setPlaylists] = useState([])

    useEffect(() => {
        load()
    }, [])

    return (
        <Paper xs={6} className="content">
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} component={Link} to="/playlist/create" style={{float:'right'}}>Create a new playlist</Button>
            <h2>List of playlists</h2>
            <List>
                    {playlists.map((playlist) => {
                        
                        const url = `/playlist/edit/${playlist.name}`
                        return <ListItem key={playlist.name}><ListItemButton component={Link} to={url}>{playlist.name}</ListItemButton></ListItem>
                    })}
            </List>
        </Paper>
    );
}

export default PlaylistList;
