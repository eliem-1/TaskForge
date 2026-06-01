using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class BoardDbContext : DbContext
{
    public BoardDbContext(DbContextOptions<BoardDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<BoardTask> Tasks { get; set; }
}
