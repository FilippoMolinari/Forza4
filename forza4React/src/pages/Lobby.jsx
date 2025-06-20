import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import sfondoBasic from "../assets/sfondoBasic.png";

function Lobby() {
  const { lobbyId } = useParams();
  const [lobby, setLobby] = useState(null);
  const navigate = useNavigate();

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
    const interval = setInterval(fetchLobby, 2000);
    return () => clearInterval(interval);
  }, [lobbyId]);

  if (!lobby) return <p className="text-white text-center mt-10">Caricamento lobby...</p>;

  const startGame= async () => {
    try {
      const response = await fetch("http://localhost:5271/api/Forza4/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Player1Name: lobby.host,
          Player2Name: lobby.guest
        })
      });

      if (!response.ok) throw new Error("Errore nell'unione alla lobby");
      const data = await response.json();
      navigate(`/game`,  {
      state: {
        player: data.playerNumber,
        name: data.currentPlayer
      }
      });
    } catch (error) {
      console.error("Errore join lobby:", error);
    }

  }

  return (
    <div
    className="h-screen w-screen bg-cover bg-center flex flex-col justify-center items-center text-white"
    style={{ backgroundImage: `url(${sfondoBasic})` }}
    >
        <div className="bg-black bg-opacity-50 p-8 rounded-2xl text-center">
            <h1 className="text-4xl font-bold mb-6">Lobby ID: {lobby.lobbyId}</h1>

            <div className="text-xl space-y-2">
            <h2 className="font-semibold text-2xl">Giocatori</h2>
            <p><strong>Host:</strong> {lobby.host}</p>
            <p><strong>Guest:</strong> {lobby.guest ? lobby.guest : "In attesa..."}</p>
            </div>

            {lobby.status === "ready" && (
            <>
                <p className="mt-4 font-bold text-green-400 text-xl">
                Pronti per iniziare! Turno: {lobby.currentTurn}
                </p>
                <button
                className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg"
                onClick={startGame}
                >
                Inizia Partita
                </button>
            </>
            )}
        </div>
    </div>
  );
}

export default Lobby;