using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly BoardDbContext _context;

    public TasksController(BoardDbContext context)
    {
        _context = context;
    }

    // 1. GET: api/tasks (Fetch all tasks including who they are assigned to)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BoardTask>>> GetTasks()
    {
        return await _context.Tasks
            .Include(t => t.AssignedUser) // Joins the tables together!
            .ToListAsync();
    }

    // 2. GET: api/tasks/users (Fetch all users so the frontend can display them in a dropdown)
    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    // 3. PUT: api/tasks/{id}/status (Updates a task's column when dragged/moved)
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] string newStatus)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound("Task not found.");

        // Update the status string ("To Do", "In Progress", "Done")
        task.Status = newStatus;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // 4. POST: api/tasks (Creates a brand new task card)
    [HttpPost]
    
    public async Task<ActionResult<BoardTask>> CreateTask(BoardTask newTask)
    {
        _context.Tasks.Add(newTask);
        await _context.SaveChangesAsync();

        // Refetch with user data to send a clean object back to React
        var createdTask = await _context.Tasks
            .Include(t => t.AssignedUser)
            .FirstOrDefaultAsync(t => t.Id == newTask.Id);

        return Ok(createdTask);
    }// 5. POST: api/tasks/users (Creates a brand new user/team member)
[HttpPost("users")]
public async Task<ActionResult<User>> CreateUser(User newUser)
{
    _context.Users.Add(newUser);
    await _context.SaveChangesAsync();
    return Ok(newUser);
}

// 6. DELETE: api/tasks/{id} (Deletes a specific task card)
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteTask(int id)
{
    var task = await _context.Tasks.FindAsync(id);
    if (task == null) return NotFound("Task not found.");

    _context.Tasks.Remove(task);
    await _context.SaveChangesAsync();

    return NoContent();
}
    
    
}