import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Lobby() {
  const { lobbyId } = useParams();
  const [lobby, setLobby] = useState(null);

  useEffect(() => {
    const fetchLobby = async () => {
      try {
        const response = await fetch(`http://localhost:5271/api/forza4lobby/${lobbyId}`);
        if (!response.ok) throw new Error("Errore nel recupero lobby");
        const data = await response.json();
        setLobby(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLobby();
    const interval = setInterval(fetchLobby, 2000); // ogni 2 secondi
    return () => clearInterval(interval);
  }, [lobbyId]);

  if (!lobby) return <p>Caricamento lobby...</p>;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Lobby ID: {lobby.lobbyId}</h1>

      <div style={{ marginTop: "2rem" }}>
        <h2>Giocatori</h2>
        <p><strong>Host:</strong> {lobby.host}</p>
        <p><strong>Guest:</strong> {lobby.guest ? lobby.guest : "In attesa..."}</p>
      </div>

      {lobby.status === "ready" && (
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: "green" }}>
          Pronti per iniziare! Turno: {lobby.currentTurn}
        </p>
      )}
    </div>
  );
}

export default Lobby;
