import { useCallback, useEffect, useState } from "react";
import { Image } from "react-konva";

const URLImage = (props) => {
    const [image, setImage] = useState(null)

    const loadCallback = useCallback((event) => {
        setImage(event.target)
    }, [])

    useEffect(() => {
        const img = new window.Image();
        img.src = props.src;
        img.addEventListener('load', loadCallback);
    }, [props.src])

    useEffect(() => {
        image?.removeEventListener('load', loadCallback)
    })

    return (
        <Image
            {...props}
            image={image}
        />
    );
}

export default URLImage