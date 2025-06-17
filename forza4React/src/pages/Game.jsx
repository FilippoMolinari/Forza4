import { useEffect, useState } from "react";
import sfondo from "../assets/sfondoBasic.png";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function Game() {
  const [board, setBoard] = useState(Array(6).fill(null).map(() => Array(7).fill(0)));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [winner, setWinner] = useState(0);
  const [searchParams] = useSearchParams();
  const player = Number(searchParams.get("player"))||0;
  const playerName = searchParams.get("name");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5271/api/forza4/board");
        if (!res.ok) throw new Error("Errore nella risposta: " + res.status);
        const data = await res.json();
        console.log("Board ricevuta:", data.board);
        setBoard(data.board);
        setCurrentPlayer(data.currentPlayer); // <- stringa
      } catch (err) {
        console.error("Errore fetch board:", err);
      }
    };
  
    fetchData();
  }, []);

  const handleMove = async (col) => {
    try {
      const res = await fetch("http://localhost:5271/api/forza4/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ column: col }),
      });
      if (!res.ok) throw new Error("Errore nella mossa");
      const data = await res.json();
      console.log("Risposta backend:", data);
      setBoard(data.board);
      setCurrentPlayer(data.currentPlayer);
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
      Tocca a: {currentPlayer} {currentPlayer === playerName && "👈 È il tuo turno"}
    </h2>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 40px)", gap: "10px", marginBottom: "1.5rem" }}>
      {[...Array(7)].map((_, colIndex) => (
        <button
        disabled={winner !== 0 || currentPlayer !== playerName}
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