import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image, Transformer } from 'react-konva';
import ImageDropZone from './ImageDropZone';
import { Grid } from '@mui/material';
import axios from 'axios';

const baseUrl = 'http://localhost:8081';
const width = 800
const height = 600

const LevelDesign = ({ initialPieces, levelChanged }) => {
    const [pieces, setPieces] = useState([]);
    const trRef = useRef()
    const [selectedPiece, setSelectedPiece] = useState()
    const loadedPiecesRef = useRef([])

    useEffect(() => {
        levelChanged(pieces)
    }, [pieces, levelChanged])

    const addPiece = useCallback((piece) => {
        piece.id = pieces.length
        setPieces([...pieces, piece])
    }, [pieces])

    const addExistingPiece = (piece) => {

    }

    const addNewPiece = (file) => {
        var formData = new FormData();
        formData.append("image", file);
        const url = `${baseUrl}/image`
        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                console.log('upload success: ' + response.data.id)

                let imgUrl = URL.createObjectURL(file)
                let image = new window.Image();
                image.src = imgUrl;
                image.addEventListener('load', () => {
                    let piece = {
                        imageId: response.data.id,
                        image: image,
                        x: width / 2 - image.width / 2,
                        y: height / 2 - image.height / 2,
                        rotation: 0,
                        isDragging: false,
                        scale: 1,
                    }
                    addPiece(piece)
                });
            })
    }

    const deletePiece = useCallback((pieceId) => {
        setPieces([...pieces.filter(function (p) {
            return p.id !== pieceId
        })])
    }, [pieces])


    const handleDragStart = (e) => {
        const id = e.target.id();
        setPieces(
            pieces.map((piece) => {
                return {
                    ...piece,
                    isDragging: piece.id === id,
                };
            })
        );
    }

    const handleDragEnd = (e) => {
        setPieces(
            pieces.map((piece) => {
                if (piece.id == e.target.id()) {
                    return {
                        ...piece,
                        x: e.target.x(),
                        y: e.target.y(),
                        isDragging: false,
                    };
                }
                else {
                    return piece;
                }
            })
        );
    }

    const handleDropImage = (images) => {
        addNewPiece(images[0])
    }

    const onTransformEnd = (e) => {
        setPieces(
            pieces.map((piece) => {
                if (e.target.id() === piece.id) {
                    return {
                        ...piece,
                        scale: e.target.scaleX(),
                        rotation: e.target.rotation()
                    };
                }
                else {

                    return piece;
                }
            })
        )
    }
    const DELETE_KEY = 46
    const handleKeyDown = useCallback((event) => {
        if (event.keyCode === DELETE_KEY) {
            if (selectedPiece) {
                deletePiece(selectedPiece.id())
            }
        }
    }, [selectedPiece, deletePiece]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown, false);

        return () => {
            document.removeEventListener("keydown", handleKeyDown, false);
        };
    }, [handleKeyDown]);



    const onSelect = (e) => {
        setSelectedPiece(e.target)
    }

    
    useEffect(() => {
        if(initialPieces){
            let i = 0
            const ratio = 0.01
            for(let p of initialPieces){
                let imgUrl = p.url
                let image = new window.Image();
                image.src = imgUrl;
                let piece = {
                    id: i,
                    image: image,
                    x: (p.positionX / ratio) - (image.width / 2),
                    y: width - ((p.positionY / ratio) + (image.height / 2)),
                    rotation: 0,
                    isDragging: false,
                    scale: 1,
                }
                ++i
                image.addEventListener('load', () => {
                    loadedPiecesRef.current.push(piece)
                    if(loadedPiecesRef.current.length === initialPieces.length){
                        setPieces(loadedPiecesRef.current)
                    }
                });
            }
        }
      }, [initialPieces])

    useEffect(() => {
        if (selectedPiece) {
            console.log('useEffect[isSelected]')
            trRef.current.nodes([selectedPiece]);
            trRef.current.getLayer().batchDraw();
        }
    }, [selectedPiece]);

    return (
        <Grid>
            <Grid item xs={6}>
                <Stage width={width} height={height} style={{ border: "solid 1px black" }}>
                    <Layer>
                        {pieces.map((piece) => {
                            return (<Image
                                innerRadius={20}
                                outerRadius={40}
                                draggable
                                shadowColor="black"
                                shadowBlur={10}
                                shadowOpacity={0.6}
                                shadowOffsetX={piece.isDragging ? 10 : 5}
                                shadowOffsetY={piece.isDragging ? 10 : 5}
                                scaleX={piece.scale}
                                scaleY={piece.scale}
                                rotation={piece.rotation}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onTransformEnd={onTransformEnd}
                                key={piece.id}
                                image={piece.image}
                                id={piece.id}
                                onClick={onSelect}
                                x={piece.x}
                                y={piece.y} />
                            )
                        }
                        )}
                        <Transformer ref={trRef}>

                        </Transformer>
                    </Layer>
                </Stage>
            </Grid>
            <Grid item xs={6}>
                <ImageDropZone onChange={handleDropImage} ></ImageDropZone>
            </Grid>
        </Grid>);
};


export default LevelDesign;