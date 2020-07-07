import React, { useState, useEffect } from 'react'

const Home = () => {

    const [users, setUsers] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async() => {
        try {
            setLoading(true);
            const users = await fetch('http://localhost:5000/api/users', {
                method: 'GET'
            });

            const usersJSON = await users.json();
            console.log(usersJSON)
            if(usersJSON.error) {
                setError(true);
            } else {
                setUsers(usersJSON);
                setLoading(false);
                setSuccess(true);
            }
        } catch(error) {
            console.log(error);
        }
    }

    const showError = (error) => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = (success) => (
        <div className="alert alert-info" style={{display: success ? '' : 'none'}}>
            <p>Users loaded successfully!</p>
        </div>
    );

    const showLoading = (loading) => (
        loading && <h2 className="text-danger">Loading...</h2>
    );

    const showUsers = () => {
        return (
            <div style={{ padding: '10px', margin: '5px' }}>
                { users.map((user) => (
                    <div key={user._id} className="card home-card" style={{ padding: '10px', margin: '20px' }} >
                    <div className="card-image">
                        <img src={user.pic} alt=""/>
                    </div>
                    <div className="card-content">
                        <h3>{user.name}</h3>
                    </div>
                </div>
                )) }
            </div>
        )
    }

    return (
        <div>
            <h3>Home Page</h3>
            {showLoading(loading)}
            {showSuccess(success)}
            {showError(error)}
            {showUsers()}
        </div> 
    )
};

export default Home;