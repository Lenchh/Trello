import { JSX } from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import './App.css';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';
import { CardModal } from './pages/Board/components/CardModal/CardModal';

function App(): JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board/:boardId" element={<Board />} />
        <Route path="/board/:boardId/card/:cardId" element={<Board />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
