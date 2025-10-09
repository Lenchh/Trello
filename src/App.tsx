import React, { JSX } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';

// function Home(): JSX.Element {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

function App(): JSX.Element {
  return (
    <BrowserRouter>
      {/* <nav>
          <Link to="/">Home</Link>
          <Link to="/board">Board</Link>
        </nav> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
