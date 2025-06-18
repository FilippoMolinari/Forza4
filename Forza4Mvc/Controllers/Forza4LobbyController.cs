using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Forza4Mvc.Models;
using Forza4Mvc.Data;

namespace Forza4Mvc.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Forza4LobbyController : ControllerBase
    {
        private readonly Forza4DbContext _context;

        public Forza4LobbyController(Forza4DbContext context)
        {
            _context = context;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateLobby([FromBody] string hostName)
        {
            var lobby = new Forza4Lobby
            {
                Host = hostName,
            };
            _context.Lobbies.Add(lobby);
            await _context.SaveChangesAsync();

            return Ok(new { lobby.LobbyId });
        }

        [HttpPost("join")]
        public async Task<IActionResult> JoinLobby([FromBody] JoinRequest request)
        {
            var lobby = await _context.Lobbies.FindAsync(request.LobbyId);
            if (lobby == null)
                return NotFound(new { error = "Lobby not found." });

            if (!string.IsNullOrEmpty(lobby.Guest))
                return BadRequest(new { error = "Lobby is already full." });

            lobby.Guest = request.GuestName;
            lobby.Status = "ready";
            lobby.CurrentTurn = new Random().Next(2) == 0 ? "host" : "guest";

            await _context.SaveChangesAsync();

            return Ok(lobby);
        }

        [HttpGet("{lobbyId}")]
        public async Task<IActionResult> GetLobby(string lobbyId)
        {
            var lobby = await _context.Lobbies.FindAsync(lobbyId);
            if (lobby == null)
                return NotFound(new { error = "Lobby not found." });

            return Ok(lobby);
        }

        [HttpDelete("{lobbyId}")]
        public async Task<IActionResult> DeleteLobby(string lobbyId)
        {
            var lobby = await _context.Lobbies.FindAsync(lobbyId);
            if (lobby == null)
                return NotFound(new { error = "Lobby not found." });

            _context.Lobbies.Remove(lobby);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Lobby deleted successfully." });
        }

        [HttpPost("leave")]
        public async Task<IActionResult> LeaveLobby([FromBody] LeaveRequest request)
        {
            var lobby = await _context.Lobbies.FindAsync(request.LobbyId);

            if (lobby == null)
                return NotFound(new { error = "Lobby not found." });

            if (request.PlayerRole == "host")
            {
                if (lobby.Guest != null)
                {
                    lobby.Host = lobby.Guest;
                    lobby.Guest = null;
                    lobby.Status = "waiting";
                }
                else
                {
                    _context.Lobbies.Remove(lobby);
                }
            }
            else if (request.PlayerRole == "guest")
            {
                if (lobby.Guest != null)
                {
                    lobby.Guest = null;
                    lobby.Status = "waiting";
                }
            }
            else
            {
                return BadRequest(new { error = "Invalid player role." });
            }
            
            return Ok(new { message = "Left lobby successfully." });
        }
    }

    public class JoinRequest
    {
        public string GuestName { get; set; }
        public string LobbyId { get; set; }
    }
    public class LeaveRequest
    {
        public string LobbyId { get; set; }
        public string PlayerRole { get; set; }
    }
}