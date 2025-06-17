import { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import './WelcomePage.css';

function WelcomePage() {
    const [player1Name, setPlayer1Name] = useState("");
    const [player2Name, setPlayer2Name] = useState("");
    const navigate = useNavigate();

    const handleStartGame = async () => {
        try {
            const response = await fetch("http://localhost:5271/api/forza4/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    player1Name,
                    player2Name
                })
            });

            if (!response.ok) {
                throw new Error("Errore nella risposta del server");
            }
            const data = await response.json();
            const playerNumber = data.playerNumber;
            const playerName = playerNumber === 1 ? player1Name : player2Name;
            navigate(`/game?player=${playerNumber}&name=${encodeURIComponent(playerName)}`);

        } catch (error) {
            console.error("Errore:", error);
        }
    };

    return (
        <div className="welcome-container">
            <div className="form-container">
                <div className="input-left">
                    <TextField
                        label="Giocatore 1"
                        value={player1Name}
                        onChange={(e) => setPlayer1Name(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                </div>
                <div className="input-right">
                    <TextField
                        label="Giocatore 2"
                        value={player2Name}
                        onChange={(e) => setPlayer2Name(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                </div>
                <div className="button-center">
                    <Button
                        variant="contained"
                        style={{ backgroundColor: 'green', color: 'white' }}
                        onClick={handleStartGame}
                    >
                        Inizia Partita
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;