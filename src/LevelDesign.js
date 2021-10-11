import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Star, Text, Image, Transformer } from 'react-konva';
import ImageDropZone from './ImageDropZone';
import { Grid } from '@mui/material';
import Piece from './Piece';

const width = 800
const height = 600

const LevelDesign = ({ initialPieces, levelChanged }) => {
    const [pieces, setPieces] = useState(initialPieces);

    useEffect(() => {
        levelChanged(pieces)
    }, [pieces, levelChanged])

    const addPiece = (piece) => {
        piece.id = pieces.length
        setPieces([...pieces, piece])
    }

    const addNewPiece = (imgUrl) => {
        let image = new window.Image();
        image.src = imgUrl;
        image.addEventListener('load', () => {
            addPiece({
                image: image,
                x: width / 2 - image.width / 2,
                y: height / 2 - image.height / 2,
                rotation: 0,
                isDragging: false,
                scale: 1,
            })
        });
    }

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
                return {
                    ...piece,
                    isDragging: false,
                };
            })
        );
    }

    const handleDropImage = (images) => {
        addNewPiece(URL.createObjectURL(images[0]))
    }

    const handleWheel = (e) => {
        e.evt.preventDefault();

        setPieces(
            pieces.map((piece) => {
                if (e.target.id() === piece.id) {
                    return {
                        ...piece,
                        scale: Math.max(0.1, piece.scale + e.evt.deltaY / 1000)
                    };
                }
                else {

                    return piece;
                }
            })
        )

    }

    const onTransformEnd = (e) => {
        console.log(e.target.scaleX())
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

    return (
        <Grid>
            <Grid item xs={6}>
                <Stage width={width} height={height} style={{ border: "solid 1px black" }}>
                    <Layer>
                        {pieces.map((piece) => {
                            return (<Piece
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
                                x={piece.x}
                                y={piece.y} />
                            )
                        }
                        )}
                    </Layer>
                </Stage>
            </Grid>
            <Grid item xs={6}>
                <ImageDropZone onChange={handleDropImage} ></ImageDropZone>
            </Grid>
        </Grid>);
};


export default LevelDesign;