import { Paper, Button, List, ListItem, ListItemButton, Menu, MenuItem } from '@mui/material'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

function LevelList() {
    const [anchorEl, setAnchorEl] = useState(null);
    const createMenuOpen = Boolean(anchorEl);
    function load() {
        const baseUrl = 'http://localhost:8081';
        const url = `${baseUrl}/levels`
        axios.get(url)
            .then(function (response) {
                // handle success
                setLevels(response.data)
            }).catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    function onClickCreate(event) {
        setAnchorEl(event.currentTarget);
    }
    function handleClose() {
        setAnchorEl(null);
    };

    let [levels, setLevels] = useState([])

    useEffect(() => {
        load()
    }, [])

    return (
        <Paper className='content'>
            <Button component={Link} variant='contained' to="/level/create/puzzle">Create Puzzle</Button>
            <Button component={Link} variant='contained' to="/level/create/basic">Create from scratch</Button>
            <Button variant='contained' onClick={onClickCreate}>Create</Button>

            <Menu
                anchorEl={anchorEl}
                open={createMenuOpen}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem component={Link} to="/level/create/puzzle">Puzzle</MenuItem>
                <MenuItem component={Link} to="/level/create/basic">From Scratch</MenuItem>
            </Menu>

            <h2>List of level</h2>
            <List>
                {levels.map((level) => {
                    const url = `/level/edit/${level.name}`
                    return <ListItem key={level.name}><ListItemButton component={Link} to={url}>{level.name}</ListItemButton></ListItem>
                })}
            </List>
        </Paper>
    );
}

export default LevelList;
