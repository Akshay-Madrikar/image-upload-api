import React from 'react';
import Routes from './routes';
import { Link } from 'react-router-dom';

const  App = () => {
  return (
    <div className="App" style={{ margin: '5px' }}>
      <h1>Welcome to image upload</h1>
      <Routes />
    </div>
  );
}

export default App;
