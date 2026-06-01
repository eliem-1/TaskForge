using Backend.Models;

namespace Backend.Data;

public static class DbSeeder
{
    public static void SeedData(BoardDbContext context)
    {
        // Check if database already has users. If yes, stop seeding.
        if (context.Users.Any() || context.Tasks.Any()) return;

        // 1. Create sample users
        var user1 = new User { Name = "Alice Smith", Email = "alice@taskforge.com" };
        var user2 = new User { Name = "Bob Jones", Email = "bob@taskforge.com" };

        context.Users.AddRange(user1, user2);
        context.SaveChanges(); // Saves users first so they get an assigned ID

        // 2. Create sample board tasks linking to those users
        context.Tasks.AddRange(
            new BoardTask 
            { 
                Title = "Design TaskForge Logo", 
                Description = "Create a minimalist dark-themed logo icon.", 
                Status = "To Do", 
                UserId = user1.Id 
            },
            new BoardTask 
            { 
                Title = "Setup PostgreSQL Database", 
                Description = "Install Postgres locally and wire connection strings.", 
                Status = "In Progress", 
                UserId = user2.Id 
            },
            new BoardTask 
            { 
                Title = "Project Initialization", 
                Description = "Initialize Frontend Vite template and Backend Web API project.", 
                Status = "Done", 
                UserId = user1.Id 
            }
        );

        context.SaveChanges();
    }
}