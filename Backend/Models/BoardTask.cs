namespace Backend.Models;

public class BoardTask
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    // Status can be: "To Do", "In Progress", or "Done"
    public string Status { get; set; } = "To Do"; 

    // Relational Foreign Key: Links this task to a specific User
    public int UserId { get; set; }
    public User? AssignedUser { get; set; }
}