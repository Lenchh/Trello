import React, { JSX } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/board">Board</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board/:boardId" element={<Board />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
