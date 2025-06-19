Nuovo
+83-0
import { useState } from "react";

const BASE_URL = "http://localhost:5271/api/forza4lobby";

function Lobby() {
  const [hostName, setHostName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [lobbyId, setLobbyId] = useState("");
  const [lobby, setLobby] = useState(null);

  const createLobby = async () => {
    if (!hostName) return;
    const res = await fetch(`${BASE_URL}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hostName)
    });
    if (res.ok) {
      const data = await res.json();
      setLobbyId(data.lobbyId);
      setLobby({ host: hostName, status: "waiting" });
    }
  };

  const joinLobby = async () => {
    if (!guestName || !lobbyId) return;
    const res = await fetch(`${BASE_URL}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestName, lobbyId })
    });
    if (res.ok) {
      const data = await res.json();
      setLobby(data);
    }
  };

  const refreshLobby = async () => {
    if (!lobbyId) return;
    const res = await fetch(`${BASE_URL}/${lobbyId}`);
    if (res.ok) {
      const data = await res.json();
      setLobby(data);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Create Lobby</h2>
      <input
        placeholder="Host name"
        value={hostName}
        onChange={(e) => setHostName(e.target.value)}
      />
      <button onClick={createLobby}>Create</button>
      {lobbyId && <p>Lobby ID: {lobbyId}</p>}

      <h2>Join Lobby</h2>
      <input
        placeholder="Lobby ID"
        value={lobbyId}
        onChange={(e) => setLobbyId(e.target.value)}
      />
      <input
        placeholder="Guest name"
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
      />
      <button onClick={joinLobby}>Join</button>

      {lobby && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Lobby Info</h3>
          <pre>{JSON.stringify(lobby, null, 2)}</pre>
          <button onClick={refreshLobby}>Refresh</button>
        </div>
      )}
    </div>
  );
}

export default Lobby;