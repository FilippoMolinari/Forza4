using Microsoft.EntityFrameworkCore;
using Forza4Mvc.Models;

namespace Forza4Mvc.Data
{
    public class Forza4DbContext : DbContext
    {
        public Forza4DbContext(DbContextOptions<Forza4DbContext> options) : base(options){}
        public DbSet<Forza4Lobby> Lobbies => Set<Forza4Lobby>();
    }
}