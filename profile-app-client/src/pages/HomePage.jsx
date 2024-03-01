import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1> Profile App</h1>
      <Link to="/auth/signup"><button>Sign Up</button></Link>
      <Link to="/auth/login"><button>Log In</button></Link>
    </div>
  );
}

export default HomePage;