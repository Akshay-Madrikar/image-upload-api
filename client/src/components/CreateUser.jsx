import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';


const CreateUser = () => {

    const [values, setValues] = useState({
        name: '',
        image: '',
        url: undefined,
        cloudinary_id: undefined
    });

    const [previewImage, setPreviewImage] = useState('');
    const history = useHistory();
    
    const { name, image, url, cloudinary_id } = values;

    useEffect(() => {
        if(url) {
            createUser();
        }
    }, [url])

    const getImageUrl = async () => {
        const data = new FormData();
        data.append('image', image);
        try {
            const imageUrl = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: data
            });
            const imageUrlJSON = await imageUrl.json();
            setValues({
                ...values,
                url: imageUrlJSON.result.secure_url,
                cloudinary_id: imageUrlJSON.result.public_id
            });
        } catch(error) {
            console.log(error);
        }
    }

    const createUser = async () => {
        try {
            const result = await fetch('http://localhost:5000/api/create', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    pic: {
                        cloudinary_url: url,
                        cloudinary_id
                    }
                })
            });
            const resultJSON = await result.json();
            history.push('/');
        } catch(error) {
            console.log(error);
        }
    }

    const handleChange = (name) => (event) => {
        const value = event.target.value;
        //const value = name === 'image' ? event.target.files[0] : event.target.value;
        setValues({
            ...values,
            [name]: value
        })
    };

    const handleImage = (event) => {
        const value = event.target.files[0];
        setValues({
            ...values,
            image: value
        })
        previewFile(value)
    }

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewImage(reader.result)
        }
    }

    const handleSubmit = (event) => {
         event.preventDefault();
        if(image) {
            getImageUrl();
        } else {
            createUser();
        }
    };

    const userForm = () => (
        <div>
            <h3>Create User page</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter name" 
                        value={name} 
                        onChange={handleChange('name')}
                    />
                </div>
                <div className="form-group">
                    <label>Select profile picture</label>
                    {/* <FileLoader onFileUpload={(imageId) => {
                        setValues({image: imageId})
                    }}
                    /> */}
                    <label>Profile picture</label>
                    <input type="file" className="form-control" onChange={handleImage}/>
                    {previewImage && (
                        <img src={previewImage} alt='chosen' style={{height: '250px', padding: '10px'}}/>
                    )}
                </div>
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>  
    )

    return (
        <div>
            {userForm()}
        </div>
    );
};

export default CreateUser;