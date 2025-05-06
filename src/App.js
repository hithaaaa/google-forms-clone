import './styles/index.css';
import NavBar from './components/Navbar.js';
import Home from './components/Home.js';
import About from './components/About.js';
import React, { useState } from 'react';

function App() {
  
  const [itemClicked, setItemClicked] = useState('home');

  return (
    <div className="w-screen">
      <NavBar setItemClicked={setItemClicked}/>
      {itemClicked === 'home' && <Home />}
      {itemClicked === 'about' && <About />}
    </div>
  );
}

export default App;
