using System.ComponentModel.DataAnnotations;

namespace Forza4Mvc.Models
{
    public class Forza4Lobby
    {
        [Key]
        public string LobbyId { get; set; } = Guid.NewGuid().ToString().Substring(0, 6).ToUpper();

        public string Host { get; set; }
        public string? Guest { get; set; }
        public string Status { get; set; } = "waiting";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? CurrentTurn { get; set; }
    }
}
