import { Paper } from '@mui/material'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

function LevelList() {

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

    let [levels, setLevels] = useState([])

    useEffect(() => {
        load()
    }, [])

    console.log(levels)

    return (
        <Paper style={{ margin: 'auto', minWidth: 400, maxWidth: 800, padding: 10 }} xs={6}>
            <h2>List of level</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {levels.map((level) => {
                        
                        const url = `/edit/${level.name}`
                        return <tr key={level.name}>
                            <td><Link to={url}>{level.name}</Link></td>
                        </tr>
                    })}
                </tbody>
            </table>
        </Paper>
    );
}

export default LevelList;
