import { useState, useEffect } from 'react'
import axios from 'axios'
import {
    useParams
  } from 'react-router-dom'
import PuzzleForm from './PuzzleForm'
import BasicForm from './BasicForm'
import config from './config'

function EditLevel() {

    const [level, setLevel] = useState(null)
    const levelId = useParams().levelId

    function load(levelId) {
        const baseUrl = config.baseApiUrl
        const url = `${baseUrl}/level/${levelId}`
        axios.get(url)
            .then(function (response) {
                // handle success
                console.log('success');
                setLevel(response.data)
            }).catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    useEffect(() => {
        if (levelId) {
            load(levelId)
        }
    }, [levelId])

    if(level){
        if(level.type === 'puzzle'){
            return <PuzzleForm level={level} />
        }
        else if(level.type === 'basic'){
            return <BasicForm level={level} />
        }
    }
    else{
        return <p>Loading...</p>
    }
}

export default EditLevel;
