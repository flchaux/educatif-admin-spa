import { ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, TextField } from "@mui/material"
import { Draggable } from "react-smooth-dnd"
import DragHandleIcon from "@mui/icons-material/DragHandle"
import { useEffect, useState } from "react"

const PieceListItem = ({piece, updatePieceName}) => {
    const [tmpName, setTmpName] = useState('')
    useEffect(() => {
        setTmpName(piece.name ?? 'Piece('+piece.id+")")
    }, [piece])
    return <Draggable>
                    <ListItem>
                        <ListItemText>
                            <TextField value={tmpName} onChange={(e) => setTmpName(e.target.value)} onBlur={(e) => updatePieceName(piece, e.target.value)} />
                        </ListItemText>
                        <ListItemSecondaryAction>
                            <ListItemIcon className="drag-handle">
                                <DragHandleIcon />
                            </ListItemIcon>
                        </ListItemSecondaryAction>
                    </ListItem>
                </Draggable>
}

export default PieceListItem