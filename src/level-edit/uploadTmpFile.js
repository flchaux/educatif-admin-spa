import axios from 'axios';
import config from '../config';

const baseUrl = config.baseApiUrl
const uploadTmpFile = (file, callback) => {
    var formData = new FormData();
    formData.append("image", file);
    const url = `${baseUrl}/image`
    axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })  
        .then(function (response) {
            callback(response.data.id)
        })
}
export default uploadTmpFile