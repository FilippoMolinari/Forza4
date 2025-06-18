import { Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import Game from './pages/Game';
import Winner from "./pages/Winner";
import Loser from "./pages/Loser";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/game" element={<Game />} />
      <Route path="/winner" element={<Winner />} />
      <Route path="/loser" element={<Loser />} />
    </Routes>
  );
}

export default App
