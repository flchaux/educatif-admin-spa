import { Grid, Switch, TextField } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
//import { STEP_BACKGROUND } from './levelSteps'

const PieceDetails = ({ selectedPiece, activeStep, updatePiece }) => {
    const [tmpName, setTmpName] = useState()
    useEffect(() => {
        setTmpName(selectedPiece.name ?? 'Piece('+selectedPiece.id+')');
      }, [selectedPiece]);
    return <Grid container spacing={2}>
        <Grid item xs={3}>
                Name
        </Grid>
        <Grid item xs={9}>
            <TextField value={tmpName} onChange={(e) => setTmpName(e.target.value)} onBlur={(e) => updatePiece({...selectedPiece, name: e.target.value})} />
        </Grid>
        {selectedPiece.validPosition ? <>
            <Grid item xs={3}>
                Valid position
            </Grid>
            <Grid item xs={9}>
                {Math.floor(selectedPiece.validPosition.x)}, {Math.floor(selectedPiece.validPosition.y)}
            </Grid></> : <></>
        }
        {selectedPiece.initialPosition ? <>
            <Grid item xs={3}>
                Initial position
            </Grid>
            <Grid item xs={9}>
                {Math.floor(selectedPiece.initialPosition.x)}, {Math.floor(selectedPiece.initialPosition.y)}
            </Grid></> : <></>
        }
        {selectedPiece.position ? <>
            <Grid item xs={3}>
                Fixed position
            </Grid>
            <Grid item xs={9}>
                {Math.floor(selectedPiece.position.x)}, {Math.floor(selectedPiece.position.y)}
            </Grid></> : <></>
        }
        {
            activeStep !== 0/*STEP_BACKGROUND*/ ? <>
                <Grid item xs={3}>
                    Has valid position
                </Grid>
                <Grid item xs={9}>
                    <Switch checked={selectedPiece.validPosition ? true : false} onChange={(e) => updatePiece({ ...selectedPiece, validPosition: e.target.checked ? selectedPiece.initialPosition : undefined })} />
                </Grid></> : <></>
        }
    </Grid>
}

export default PieceDetails