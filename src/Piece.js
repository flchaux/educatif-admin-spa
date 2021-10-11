import { useEffect, useRef, useState } from "react"
import { Image, Transformer } from "react-konva"

const Piece = (props) => {
    const ref = useRef()
    const trRef = useRef()
    const [isSelected, setIsSelected] = useState(false)

    const onSelect = () => {
        console.log('onSelect')
        setIsSelected(true)
    }

    useEffect(() => {
        if (isSelected) {
            console.log('useEffect[isSelected]')
          trRef.current.nodes([ref.current]);
          trRef.current.getLayer().batchDraw();
        }
      }, [isSelected]);

    return <><Image
            ref={ref}
            innerRadius={20}
            outerRadius={40}
            draggable
            shadowColor="black"
            shadowBlur={10}
            shadowOpacity={0.6}
            {...props}
            onClick={onSelect}
        /><Transformer ref={trRef}>
        
        </Transformer></>
}

export default Piece