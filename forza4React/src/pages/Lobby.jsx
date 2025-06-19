import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sfondo from "../assets/sfondoBasic.png";

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
        color: "white",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
        Lobby ID: {lobby.lobbyId}
      </h1>

      <div
        style={{
          background: "rgba(0,0,0,0.5)",
          padding: "1rem 2rem",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ marginBottom: "0.5rem" }}>Giocatori connessi</h2>
        <p>
          <strong>Host:</strong> {lobby.host}
        </p>
        <p>
          <strong>Guest:</strong> {lobby.guest ? lobby.guest : "In attesa..."}
        </p>
      </div>

      {lobby.status === "ready" && (
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: "lime" }}>
          Pronti per iniziare! Turno: {lobby.currentTurn}
        </p>
      )}
    </div>
  );
}

export default Lobby;
