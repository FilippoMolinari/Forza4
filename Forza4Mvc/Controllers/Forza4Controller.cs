using Microsoft.AspNetCore.Mvc;
using Forza4Mvc.Models;

[ApiController]
[Route("api/[controller]")]
public class Forza4Controller : ControllerBase
{
    private static Forza4Game game = new Forza4Game();
    private static int connectedPlayers = 0;

    [HttpPost("start")]
    public IActionResult StartGame([FromBody] PlayerNamesRequest data)
    {
        if (connectedPlayers >= 2)
        {
            return BadRequest(new { error = "La partita è già piena." });
        }

        if (connectedPlayers == 0)
        {
            game.SetPlayerNames(data.Player1Name, data.Player2Name);
            game.ResetGame();
        }

        connectedPlayers++;

        int playerNumber = connectedPlayers;

        return Ok(new
        {
            message = "Giocatore connesso",
            playerNumber = playerNumber,
            currentPlayer = game.CurrentPlayer,
            currentPlayerName = game.GetCurrentPlayerName,
            board = game.GetBoard
        });
    }

    [HttpPost("move")]
    public IActionResult Move([FromBody] MoveRequest data)
    {
        var result = game.MakeMove(data.Column);

        return Ok(new
        {
            status = result.ToString(),
            currentPlayer = game.CurrentPlayer,
            currentPlayerName = game.GetCurrentPlayerName,
            board = game.GetBoard,
            winner = game.GetWinner
        });
    }

    [HttpGet("board")]
    public IActionResult GetBoard()
    {
        return Ok(new
        {
            board = game.GetBoard,
            currentPlayer = game.CurrentPlayer,
            currentPlayerName = game.GetCurrentPlayerName
        });
    }
    
    [HttpPost("reset")]
    public IActionResult Reset()
    {
        connectedPlayers = 0;
        game.ResetGame();
        return Ok(new { message = "Reset eseguito" });
    }
}