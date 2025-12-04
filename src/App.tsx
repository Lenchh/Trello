import { JSX } from 'react';
import { Routes, Route, Link, HashRouter } from 'react-router-dom';
import './App.css';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';

function App(): JSX.Element {
  return (
    <HashRouter>
      <nav>
        <Link to="/" className="home">
          Home
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board/:boardId" element={<Board />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
