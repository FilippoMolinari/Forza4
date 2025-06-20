import { useEffect, useState } from "react";
import sfondo from "../assets/sfondoBasic.png";
import { useNavigate, useLocation } from "react-router-dom";


function Game() {
  const [board, setBoard] = useState(Array(6).fill(null).map(() => Array(7).fill(0)));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [currentPlayerName, setCurrentPlayerName] = useState("");
  const [winner, setWinner] = useState(0);
  const location = useLocation();
  const { player, name } = location.state || {};
  console.log("Giocatore:", player, "Nome:", name);
  if (!player || !name) return <p>Errore: dati mancanti.</p>;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5271/api/Forza4/board");
        if (!res.ok) throw new Error("Errore nella risposta: " + res.status);
        const data = await res.json();
        console.log("Board ricevuta:", data.board);
        setBoard(data.board);
        setCurrentPlayer(data.currentPlayer);
        setCurrentPlayerName(data.currentPlayerName);
      } catch (err) {
        console.error("Errore fetch board:", err);
      }
    };
  
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleMove = async (col) => {
    try {
      const res = await fetch("http://localhost:5271/api/Forza4/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ column: col }),
      });
      if (!res.ok) throw new Error("Errore nella mossa");
      const data = await res.json();
      console.log("Risposta backend:", data);
      setBoard(data.board);
      setCurrentPlayer(data.currentPlayer);
      setCurrentPlayerName(data.currentPlayerName);
      if (data.winner && data.winner !== 0) {
        setWinner(data.winner);
        if (data.winner === player) {
          navigate("/winner");
        } else {
          navigate("/loser");
        }
      }
    } catch (err) {
      console.error("Errore nella mossa:", err);
    }
  };

  return (
    <div
    style={{
      minHeight: "100vh",
      backgroundImage: `url(${sfondo})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}
  >
    <h2 style={{ color: "white" }}>
      Tocca a: {currentPlayerName} {currentPlayer === player && "È il tuo turno"}
    </h2>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 40px)", gap: "10px", marginBottom: "1.5rem" }}>
      {[...Array(7)].map((_, colIndex) => (
        <button
        disabled={winner !== 0 || currentPlayer !== player}
          key={colIndex}
          onClick={() => handleMove(colIndex)}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          ▼
        </button>
      ))}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 40px)", gap: "10px" }}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor:
                cell === 1 ? "red" : cell === 2 ? "yellow" : "white",
              boxShadow: "inset 0 0 5px black"
            }}
          ></div>
        ))
      )}
    </div>
  </div>
  );
}

export default Game;