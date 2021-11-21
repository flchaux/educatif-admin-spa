import { useEffect, useState } from "react";
import { Image } from "react-konva";

const URLImage = (props) => {
    const [image, setImage] = useState(null)
    console.log(props.src)

    useEffect(() => {
        const img = new window.Image();
        img.src = props.src;
        img.addEventListener('load', () => {
            console.log('load ok')
            setImage(img)
        });
    }, [props.src])

    return (
        <Image
            {...props}
            image={image}
        />
    );
}

export default URLImage