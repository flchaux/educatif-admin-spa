import { useState, useEffect } from 'react'
import axios from 'axios'
import {
    useParams
  } from 'react-router-dom'
import PuzzleForm from './PuzzleForm'

function EditLevel() {

    const [level, setLevel] = useState(null)
    const levelId = useParams().levelId

    function load(levelId) {
        const baseUrl = 'http://localhost:8081';
        const url = `${baseUrl}/bundle/${levelId}`
        axios.get(url)
            .then(function (response) {
                // handle success
                console.log('success');
                setLevel({
                    width: parseInt(response.data.specs.size.width),
                    height: parseInt(response.data.specs.size.height),
                    name: response.data.bundle,
                    file: baseUrl+'/bundle/'+response.data.bundle+"/src.png"
                })
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

    return level ? <PuzzleForm level={level} /> : <p>Loading...</p>
}

export default EditLevel;
