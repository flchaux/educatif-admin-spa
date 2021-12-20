import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Stage, Layer, Image, Transformer } from 'react-konva';
import ImageDropZone from './ImageDropZone';
import { Button, Grid, List, Step, StepLabel, Stepper, Switch } from '@mui/material';
import uploadTmpFile from './uploadTmpFile'
import PieceDetails from './PieceDetails';
import {steps, STEP_BACKGROUND, STEP_INITIAL_POSITION, STEP_FINAL_POSITION, STEP_STATIC} from './levelSteps'
import PieceList from './PieceList';
import URLImage from './URLImage';

const width = 1100
const height = 500
const clientPixelsPerUnit = 100

function computePieceCanvasPosition(position, ratio, sizeRatio, imageSize) {
    return {
        x: (position.x / ratio) - ((imageSize.width / sizeRatio) / 2),
        y: height - ((position.y / ratio) + ((imageSize.height / sizeRatio) / 2)),
    }
}


const LevelDesign = ({ levelChanged, level }) => {
    const [pieces, setPieces] = useState([])
    const [background, setBackground] = useState({})
    const [backgroundUrl, setBackgroundUrl] = useState()
    const trRef = useRef()
    const [selectedImage, setSelectedImage] = useState()
    const [activeStep, setActiveStep] = useState(STEP_BACKGROUND)
    const loadedPiecesRef = useRef([])
    const ratio = level.size.width / width
    const sizeRatio = ratio * clientPixelsPerUnit

    const selectedPiece = useMemo(() => selectedImage == null ? null : pieces.find(p => p.id.toString() === selectedImage.id().toString()), [selectedImage, pieces])

    useEffect(() => {
        levelChanged({ pieces: pieces, background:background })

    }, [pieces, levelChanged, background])

    const addPiece = useCallback((piece) => {
        piece.id = pieces.length
        setPieces([...pieces, piece])
    }, [pieces])

    const reorderPieces = (oldIndex, newIndex) => {
        let newPieces = []
        let direction = (newIndex < oldIndex) ? -1 : 1
        for(let i = 0; i < pieces.length; ++i){
            if(newIndex === i){
                newPieces[i] = pieces[oldIndex]
                
            }
            else if((i > newIndex && i <= oldIndex) || (i < newIndex && i >= oldIndex)){
                newPieces[i] = pieces[i+direction]
            }
            else {
                newPieces[i] = pieces[i]
            }
        }
        setPieces(newPieces)
    }

    const createPiece = (file, callback) => {

        uploadTmpFile(file, (imageId) => {
            console.log('upload success: ' + imageId)

            let imgUrl = URL.createObjectURL(file)
            let image = new window.Image();
            image.src = imgUrl;
            image.addEventListener('load', () => {
                callback(imageId, image)

            });
        })
    }

    const addNewPiece = (file, fixed) => {
        
        createPiece(file, (imageId, image) => {
            let piece = {
                imageId: imageId,
                image: image,
                rotation: 0,
                isDragging: false,
                scale: 1,
                name: file.name.replace(/\.[^/.]+$/, ""),
            }
            if (fixed) {
                piece.position = {
                    x: width / 2 - image.width / 2,
                    y: height / 2 - image.height / 2,
                }
            }
            else {
                piece.validPosition = {
                    x: width / 2 - image.width / 2,
                    y: height / 2 - image.height / 2,
                }
                piece.initialPosition = {
                    x: width / 2 - image.width / 2,
                    y: height / 2 - image.height / 2,
                }
            }
            addPiece(piece)
        });
    }

    const deletePiece = useCallback((pieceId) => {
        setSelectedImage(null)
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

    const computePosition = (piece, x, y) => {
        const position = {
            x: x,
            y: y,
        }
        return activeStep === STEP_FINAL_POSITION && piece.validPosition ? {
            validPosition: position
        } : (activeStep === STEP_INITIAL_POSITION && piece.initialPosition) ? {
            initialPosition: position
        } : {
            position: position
        }
    }

    const handleDragEnd = (e) => {
        setPieces(
            pieces.map((piece) => {
                if (piece.id.toString() === e.target.id().toString()) {

                    return {
                        ...piece,
                        ...computePosition(piece, e.target.x(), e.target.y()),
                        isDragging: false,
                    };
                }
                else {
                    return piece;
                }
            })
        );
    }

    const clickBackground = (e) => {
        if (e.target.constructor.name === 'Stage') {
            setSelectedImage(null)
        }
    }

    const handleDropImage = (images) => {
        if(activeStep === STEP_BACKGROUND){
            uploadBackgorund(images[0])
        }
        else{
            addNewPiece(images[0], activeStep === STEP_STATIC)
        }
    }

    
    
    const uploadBackgorund = (file) => {
        
        uploadTmpFile(file, (imageId) => {
            setBackground({ imageId })
            setBackgroundUrl(URL.createObjectURL(file))
        })
       
    }

    const updatePiece = (piece) => {
        setPieces(
            pieces.map((p) => {
                if (piece.id === p.id) {
                    return {
                        ...piece
                    };
                }
                else {
                    return p;
                }
            }))
    }

    const onTransformEnd = (e) => {
        setPieces(
            pieces.map((piece) => {
                if (e.target.id() === piece.id) {

                    return {
                        ...piece,
                        scale: e.target.scaleX() * sizeRatio,
                        rotation: e.target.rotation(),
                        ...computePosition(piece, e.target.x(), e.target.y())
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
            if (selectedImage) {
                deletePiece(selectedImage.id())
            }
        }
    }, [selectedImage, deletePiece]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown, false);

        return () => {
            document.removeEventListener("keydown", handleKeyDown, false);
        };
    }, [handleKeyDown]);

    const onSelect = (e) => {
        setSelectedImage(e.target)
    }


    useEffect(() => {
        if (level.pieces) {
            let images = []

            for (let i = 0; i < level.pieces.length; ++i) {
                let p = level.pieces[i]
                let imgUrl = p.url
                let image = new window.Image();
                image.src = imgUrl;
                images.push(image)
                image.addEventListener('load', () => {
                    let image = images[i]
                    let piece = {
                        id: p.id,
                        image: image,
                        imageSrc: p.image,
                        validPosition: p.validPosition ? computePieceCanvasPosition(p.validPosition, ratio, sizeRatio, image) : null,
                        initialPosition: p.initialPosition ? computePieceCanvasPosition(p.initialPosition, ratio, sizeRatio, image) : null,
                        position: p.position ? computePieceCanvasPosition(p.position, ratio, sizeRatio, image) : null,
                        rotation: 0,
                        isDragging: false,
                        scale: 1,
                        name: p.name
                    }
                    ++i
                    loadedPiecesRef.current[i] = piece
                    if (loadedPiecesRef.current.length === level.pieces.length) {
                        setPieces(loadedPiecesRef.current)
                    }
                })
            }
        }
        if(level.background){
            setBackground(level.background)
            setBackgroundUrl(level.background.url)
        }
    }, [level.pieces, ratio, sizeRatio])

    useEffect(() => {
        if (selectedImage) {
            trRef.current.nodes([selectedImage]);
            trRef.current.getLayer().batchDraw();
        }
        else {
            if (trRef.current) {
                trRef.current.nodes([]);
                trRef.current.getLayer().batchDraw();
            }
        }
    }, [selectedImage]);

    return (
        <Grid container spacing={12}>
            <Grid item xs={12}>
                <Stepper activeStep={activeStep}>
                    {steps.map((s, i) => <Step key={i}><StepLabel>{s}</StepLabel></Step>)}
                </Stepper>
            </Grid>
            <Grid item xs={8}>
                <ImageDropZone onChange={handleDropImage} style={{ width: width, margin: 'auto', boxSizing: 'border-box' }}>
                    <Stage width={width} height={height} style={{ border: "solid 1px black" }} onClick={clickBackground}>
                        <Layer>
                            <URLImage onClick={clickBackground} src={backgroundUrl} 
                                    scaleX={ 1 / sizeRatio }
                                    scaleY={ 1 / sizeRatio} />
                            {activeStep === STEP_BACKGROUND ? <></> : pieces.filter(p => p.position || (activeStep === STEP_INITIAL_POSITION) || (p.validPosition && activeStep !== STEP_BACKGROUND && activeStep !== STEP_STATIC)).map((piece) => {
                                const position = piece.position ?? ((activeStep === STEP_FINAL_POSITION) ? piece.validPosition : piece.initialPosition)

                                return (<Image
                                    innerRadius={20}
                                    outerRadius={40}
                                    draggable
                                    shadowColor="black"
                                    shadowBlur={10}
                                    shadowOpacity={0.6}
                                    shadowOffsetX={piece.isDragging ? 10 : 5}
                                    shadowOffsetY={piece.isDragging ? 10 : 5}
                                    scaleX={piece.scale / sizeRatio}
                                    scaleY={piece.scale / sizeRatio}
                                    rotation={piece.rotation}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                    onTransformEnd={onTransformEnd}
                                    key={piece.id}
                                    image={piece.image}
                                    id={piece.id}
                                    onClick={onSelect}
                                    x={position.x}
                                    y={position.y} />
                                )
                            }
                            )}
                            <Transformer ref={trRef}>

                            </Transformer>
                        </Layer>
                    </Stage>
                </ImageDropZone>
            </Grid>
            <Grid item xs={4}>
                {
                    selectedImage ? (
                        <PieceDetails selectedPiece={selectedPiece} activeStep={activeStep} updatePiece={updatePiece} />) 
                        : <p style={{ textAlign: 'center' }}>Select or upload a piece</p>
                }
            </Grid>
            <Grid item xs={12}><PieceList pieces={pieces} orderChanged={reorderPieces} pieceChanged={updatePiece} /></Grid>
            <Grid item xs={2}>{activeStep > 0 ? <Button onClick={() => setActiveStep(Math.max(activeStep - 1, 0))}>Previous</Button> : <></>}</Grid>
            <Grid item xs={8}></Grid>
            <Grid item xs={2}>{activeStep < steps.length - 1 ? <Button onClick={() => setActiveStep(Math.min(activeStep + 1, steps.length))}>Next</Button> : <></>}</Grid>
        </Grid>
    );
};

export default LevelDesign;