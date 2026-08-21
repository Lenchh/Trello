import { JSX } from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { PrivateRoutes } from './common/private_routes/PrivateRoutes';
import './App.css';

function App(): JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/board/:boardId" element={<Board />} />
          <Route path="/board/:boardId/card/:cardId" element={<Board />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
