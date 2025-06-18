namespace Forza4Mvc.Models
{
    public class Forza4Game
    {
        public string Player1Name { get; private set; } = "Player 1";
        public string Player2Name { get; private set; } = "Player 2";
        private int rows = 6;
        private int columns = 7;
        private readonly int[][] board;
        public Forza4Game()
        {
            board = new int[6][];
            for (int i = 0; i < 6; i++)
            {
                board[i] = new int[7];
            }
        }
        private int winner = 0;

        private int currentPlayer = 1;
        public enum GameStatus
        {
            InProgress,
            Player1Wins,
            Player2Wins,
            Draw
        }

        public int[][] GetBoard => board;
        public int GetWinner => winner;
        public string GetCurrentPlayerName => currentPlayer == 1 ? Player1Name : Player2Name;

        public void SetPlayerNames(string name1, string name2)
        {
            Player1Name = string.IsNullOrWhiteSpace(name1) ? "Player 1" : name1;
            Player2Name = string.IsNullOrWhiteSpace(name2) ? "Player 2" : name2;
        }

        public void ResetGame()
        {
            for (int i = 0; i < rows; i++)
                for (int y = 0; y < columns; y++)
                    board[i][y] = 0;
            currentPlayer = 1;
            winner = 0;
        }

        public bool IsBoardFull()
        {
            for (int col = 0; col < columns; col++)
            {
                if (board[0][col] == 0)
                    return false;
            }
            return true;
        }

        public bool IsWinningState()
        {
            for (int row = 0; row < 6; row++)
            {
                for (int col = 0; col < 7; col++)
                {
                    int player = board[row][col];
                    if (player == 0)
                        continue;

                    if (col <= 3 &&
                        player == board[row][col + 1] &&
                        player == board[row][col + 2] &&
                        player == board[row][col + 3])
                        return true;

                    if (row <= 2 &&
                        player == board[row + 1][col] &&
                        player == board[row + 2][col] &&
                        player == board[row + 3][col])
                        return true;

                    if (row <= 2 && col <= 3 &&
                        player == board[row + 1][col + 1] &&
                        player == board[row + 2][col + 2] &&
                        player == board[row + 3][col + 3])
                        return true;

                    if (row <= 2 && col >= 3 &&
                        player == board[row + 1][col - 1] &&
                        player == board[row + 2][col - 2] &&
                        player == board[row + 3][col - 3])
                        return true;
                }
            }

            return false;
        }

        public GameStatus CheckBoard()
        {
            if (IsBoardFull())
                return GameStatus.Draw;

            if (IsWinningState())
                return currentPlayer == 1 ? GameStatus.Player1Wins : GameStatus.Player2Wins;

            return GameStatus.InProgress;
        }

        public GameStatus MakeMove(int column)
        {
            var status = CheckBoard();
            if (status != GameStatus.InProgress)
                return status;

            if (column < 0 || column >= columns)
                return GameStatus.InProgress;

            for (int row = rows - 1; row >= 0; row--)
            {
                if (board[row][column] == 0)
                {
                    board[row][column] = currentPlayer;

                    if (IsWinningState())
                    {
                        winner = currentPlayer;
                        return currentPlayer == 1 ? GameStatus.Player1Wins : GameStatus.Player2Wins;
                    }

                    if (IsBoardFull())
                        return GameStatus.Draw;

                    currentPlayer = currentPlayer == 1 ? 2 : 1;

                    return GameStatus.InProgress;
                }
            }

            return GameStatus.InProgress;
        }

    }
    public class PlayerNamesRequest
    {
        public string Player1Name { get; set; } = "";
        public string Player2Name { get; set; } = "";
    }
    public class MoveRequest
    {
        public int Column { get; set; }
    }
}
