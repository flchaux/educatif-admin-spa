import { List } from "@mui/material"
import { Container } from "react-smooth-dnd"
import PieceListItem from "./PieceListItem"

const PieceList = ({pieces, orderChanged, pieceChanged}) => {
    const onDrop = ({removedIndex, addedIndex}) => {
        orderChanged(removedIndex, addedIndex)
    }
    const updatePieceName = (p, name) => {
        pieceChanged({...p, name})
    }
    return <List>
        <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
            {pieces.map(p => <PieceListItem key={p.id} piece={p} updatePieceName={updatePieceName} />)}
        </Container>
    </List>
}

export default PieceList