import { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import './WelcomePage.css';

function WelcomePage() {
  const [playerName, setPlayerName] = useState("");
  const [lobbyCode, setLobbyCode] = useState("");
  const [joinMode, setJoinMode] = useState(false);
  const navigate = useNavigate();

  const createLobby = async () => {
    try {
      const response = await fetch("http://localhost:5271/api/forza4lobby/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(playerName)
      });

      if (!response.ok) throw new Error("Errore nella creazione della lobby");
      const data = await response.json();
      navigate(`/lobby/${data.lobbyId}`);
    } catch (error) {
      console.error("Errore creazione lobby:", error);
    }
  };

  const joinLobby = async () => {
    try {
      const response = await fetch("http://localhost:5271/api/forza4lobby/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          guestName: playerName,
          lobbyId: lobbyCode
        })
      });

      if (!response.ok) throw new Error("Errore nell'unione alla lobby");
      const data = await response.json();
      navigate(`/lobby/${data.lobbyId}`);
    } catch (error) {
      console.error("Errore join lobby:", error);
    }
  };

  return (
    <div className="welcome-container">
        <div className="form-container">
            <TextField
            label="Il tuo nome"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            fullWidth
            variant="outlined"
            />

            {joinMode && (
            <TextField
                label="Codice Lobby"
                value={lobbyCode}
                onChange={(e) => setLobbyCode(e.target.value)}
                fullWidth
                variant="outlined"
            />
            )}

            <div className="button-row">
            <button onClick={createLobby}>Crea Lobby</button>
            {!joinMode ? (
                <button className="secondary" onClick={() => setJoinMode(true)}>
                Unisciti
                </button>
            ) : (
                <button className="secondary" onClick={joinLobby}>
                Entra
                </button>
            )}
            </div>
        </div>
    </div>
  );
}

export default WelcomePage;