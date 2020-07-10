import React, { useState, useEffect, useRef, createRef } from 'react';
//import Spinner from './Spinner';

const FileLoader = ({ onFileUpload }) => {

    const [imgBase64, setImageBase64] = useState('');
    const [imgStatus, setImageStatus] = useState('INIT');

    const fileReader = new FileReader();
    const selectedImage = useRef(null);

    useEffect(() => {
        fileLoading();
        return removeFileListener(); // works as componentWillUnmount
    }, []);

    const fileLoading = () => {
        // convert image file to base64 string
        fileReader.addEventListener('load', (event) => {
            setImageBase64(event.target.result);
            setImageStatus('LOADED');
        })
    };

    const removeFileListener = () => {
        // Always remove listeners if used!
        fileReader.removeEventListener('load', (event) => {
            setImageBase64(event.target.result);
        });
    };

    const handleChange = (event) => {
        selectedImage.current = event.target.files[0];
        // To get base64 representation of our image
        if(selectedImage) {
            fileReader.readAsDataURL(selectedImage.current);
        }
    };

    const handleImageUpload = async () => {
        const data = new FormData();
        data.append('image', selectedImage.current);
        try {
            setImageStatus('PENDING');
            const imageUrl = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: data
            });
            const imageUrlJSON = await imageUrl.json();
            if(imageUrlJSON) {
                alert('Image uploaded!');
                setImageStatus('UPLOADED');
            } else {
                alert('Upload failed!')
                setImageStatus('ERROR');
            }
            console.log(imageUrlJSON)

        } catch(error) {
            console.log(error);
        }
    };

    const handleCancel = () => {
        selectedImage.current = null;
        setImageBase64('');
        setImageStatus('INIT');
    };

    return (
        <div className="img-upload-container">
            <label className="img-upload btn btn-primary">
                <span>Choose</span>
                <input 
                    type="file" 
                    accept=".jpg, .jpeg, .png"
                    onChange={handleChange}
                    style={{display: 'none'}}
                /> 
            </label>  
            { imgBase64 &&
                <>
                    <div className="mb-2" style={{backgroundColor: '#f7f7f7', padding: '10px'}}> 
                        <div style={{height: '116px'}}>
                            <img src={imgBase64} style={{height: '100%'}}/>
                        </div>
                        {   imgStatus === 'PENDING' &&
                            <div className="spinner-container">
                                Loading...
                                {/* <Spinner /> */}
                            </div>
                        }
                        {   imgStatus === 'UPLOADED' &&
                            <div className="alert alert-success">
                                Image has been uploaded!
                            </div>
                        }
                        {   imgStatus === 'ERROR' &&
                            <div className="alert alert-danger">
                                Image upload failed!
                            </div>
                        }
                    </div>
                    
                        {   imgStatus === 'LOADED' &&
                            <button className="btn btn-success mr-1" onClick={handleImageUpload}>Upload</button>
                        }
                            <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                </>
            } 
        </div>
    );
};

export default FileLoader;
