import { useState } from 'react';
import LevelDesign from './LevelDesign'
import { Button, TextField, Paper, Grid } from '@mui/material'
import axios from 'axios'
import { useHistory } from 'react-router'
import Delete from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function BasicForm(props) {
    const [level, setLevel] = useState({
        name: "",
        pieces: []
    });

    const onLevelChanged = (pieces) => {
        //setLevel({...level, pieces: pieces})
    }

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
    }

    return <Paper style={{ margin: 'auto', width: 1600, padding: 10 }} xs={6}>
    <ArrowBackIcon style={{cursor: 'pointer', float: 'left'}} onClick={() => back()} />
    {!props.level ? <h2>Create a level</h2> : <h2>See level "{level.name}"</h2>}
    <form onSubmit={create}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
                Name
            </Grid>
            <Grid item xs={6}>
                <TextField value={level.name} onChange={handleNameChange} style={{ width: '100%' }} disabled={props.level ? true : false} />
            </Grid>
            <Grid item xs={12}>
                <LevelDesign initialPieces={level.pieces} levelChanged={onLevelChanged} />
            </Grid>
            
            <Grid item xs={10}>
                {!props.level ?  <Button type="submit">Create</Button> : <></>}
            </Grid>

        </Grid>
    </form>
</Paper>
}

export default BasicForm;
