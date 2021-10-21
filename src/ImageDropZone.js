import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

function ImageDropZone(props) {
    const onDrop = useCallback(acceptedFiles => {
      props.onChange(acceptedFiles)
    }, [props])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, noClick: true})
  
    if(props.children){
      return <div {...props} {...getRootProps()}>
        {props.disabled ? <></> : <input {...getInputProps()} /> }
        {props.children}
      </div>
    }
    else{
      return <div style={{position:'relative', margin: 'auto', cursor: 'pointer', textAlign: 'center', width: '100%', height: 300, backgroundColor: 'lightblue' }} {...getRootProps()}>
      {props.disabled ? <></> : <input {...getInputProps()} /> }
      <div syle={{margin: 'auto'}}>
      {
        
        !props.file ? 
          (isDragActive ?
            <p>Drop the file here ...</p> :
            <p>Drag 'n' drop the image file here<br/>or click to select the file</p>) : 
            <img alt="source" src={props.file} style={{ position:'absolute', top: '50%', left:'50%', transform: 'translate(-50%, -50%)',maxWidth:'100%', maxHeight:300, display: 'block' }} />
            
      }
      </div>
    </div>
    }
  }
  export default ImageDropZone;