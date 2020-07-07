import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom'

const CreateUser = () => {

    const [values, setValues] = useState({
        name: '',
        image: '',
        url: undefined
    });
    const history = useHistory();
    
    const { name, image, url } = values;

    useEffect(() => {
        if(url) {
            createUser();
        }
    }, [url])

    const getImageUrl = async () => {
        const data = new FormData();
        data.append('file', image);
        try {
            const imageUrl = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: data
            });
            const imageUrlJSON = await imageUrl.json();
            setValues({
                url: imageUrlJSON.secure_url
            });
            console.log(url)
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
                    pic: url
                })
            });
            const resultJSON = await result.json();
            console.log(resultJSON);
            history.push('/');
        } catch(error) {
            console.log(error);
        }
    }

    const handleChange = (name) => (event) => {
        const value = name === 'image' ? event.target.files[0] : event.target.value;
        setValues({
            ...values,
            [name]: value
        })
    };

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
                    <label>Profile picture</label>
                    <input type="file" className="form-control" onChange={handleChange('image')}/>
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