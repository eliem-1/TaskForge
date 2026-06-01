import { useEffect, useState } from "react";
import type { BoardTask, User } from "./types";

const API_BASE = "http://localhost:5065/api/tasks";

export default function App() {
  const [tasks, setTasks] = useState<BoardTask[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Task Form input fields state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  // New User Form input field state
  const [newUserName, setNewUserName] = useState("");

  // 1. Fetch data when the page loads
  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => setTasks(data));

    fetch(`${API_BASE}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // 2. Add a new task card
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedUserId) return alert("Please fill in Title and User");

    const newTask = {
      title,
      description,
      status: "To Do",
      userId: parseInt(selectedUserId),
    };

    fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((createdTask: BoardTask) => {
        setTasks([...tasks, createdTask]);
        setTitle("");
        setDescription("");
        setSelectedUserId("");
      });
  };

  // 3. Add a new User/Team Member
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName) return alert("Please enter a name");

    const newUser = { name: newUserName, email: `${newUserName.toLowerCase().replace(/\s+/g, '')}@taskforge.com` };

    fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((createdUser: User) => {
        setUsers([...users, createdUser]); // Dynamically appends to state dropdown list!
        setNewUserName("");
      });
  };

  // 4. Update task status when moving columns
  const handleMoveTask = (taskId: number, currentStatus: "To Do" | "In Progress" | "Done", direction: "forward" | "backward") => {
    const statuses: ("To Do" | "In Progress" | "Done")[] = ["To Do", "In Progress", "Done"];
    let currentIndex = statuses.indexOf(currentStatus);
    
    if (direction === "forward" && currentIndex < 2) currentIndex++;
    if (direction === "backward" && currentIndex > 0) currentIndex--;
    
    const newStatus = statuses[currentIndex];

    fetch(`${API_BASE}/${taskId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStatus),
    }).then(() => {
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    });
  };

  // 5. Delete a task permanently from Postgres
  const handleDeleteTask = (taskId: number) => {
    if (!confirm("Are you sure you want to purge this task from the database?")) return;

    fetch(`${API_BASE}/${taskId}`, {
      method: "DELETE",
    }).then(() => {
      // Remove it instantly from the screen state ledger
      setTasks(tasks.filter((t) => t.id !== taskId));
    });
  };

  const columns: ("To Do" | "In Progress" | "Done")[] = ["To Do", "In Progress", "Done"];

  return (
    <div style={{ backgroundColor: "#121214", color: "#e1e1e6", minHeight: "100vh", padding: "2rem", fontFamily: "sans-serif" }}>
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#4ade80", margin: 0 }}>⚒️ TaskForge Board</h1>
        <p style={{ color: "#8d8d99" }}>PostgreSQL-Powered Agile Management System</p>
      </header>

      {/* DOUBLE FORMS ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        
        {/* NEW TASK FORM */}
        <form onSubmit={handleCreateTask} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", backgroundColor: "#202024", padding: "1.5rem", borderRadius: "8px" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#4ade80" }}>⚙️ Create New Task</h3>
          <input type="text" placeholder="Task Title..." value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "4px", border: "1px solid #29292e", backgroundColor: "#121214", color: "#fff" }} />
          <input type="text" placeholder="Description..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "4px", border: "1px solid #29292e", backgroundColor: "#121214", color: "#fff" }} />
          <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "4px", border: "1px solid #29292e", backgroundColor: "#121214", color: "#fff" }}>
            <option value="">Assign To...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <button type="submit" style={{ padding: "0.5rem 1.5rem", borderRadius: "4px", border: "none", backgroundColor: "#00b37e", color: "#fff", fontWeight: "bold", cursor: "pointer", marginTop: "auto" }}>+ Add Task</button>
        </form>

        {/* NEW USER FORM */}
        <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", backgroundColor: "#202024", padding: "1.5rem", borderRadius: "8px" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#a855f7" }}>👤 Add Team Member</h3>
          <input type="text" placeholder="Full Name (e.g. John Doe)..." value={newUserName} onChange={(e) => setNewUserName(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "4px", border: "1px solid #29292e", backgroundColor: "#121214", color: "#fff" }} />
          <button type="submit" style={{ padding: "0.5rem 1.5rem", borderRadius: "4px", border: "none", backgroundColor: "#a855f7", color: "#fff", fontWeight: "bold", cursor: "pointer", marginTop: "auto" }}>+ Recruit User</button>
        </form>

      </div>

      {/* AGILE BOARD COLUMNS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {columns.map((col) => (
          <div key={col} style={{ backgroundColor: "#202024", borderRadius: "8px", padding: "1rem", minHeight: "450px", borderTop: col === "To Do" ? "4px solid #fba94c" : col === "In Progress" ? "4px solid #00b37e" : "4px solid #8d8d99" }}>
            <h3 style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 0 }}>
              {col} <span style={{ marginLeft: "auto", fontSize: "0.9rem", backgroundColor: "#121214", padding: "0.2rem 0.6rem", borderRadius: "20px", color: "#8d8d99" }}>{tasks.filter((t) => t.status === col).length}</span>
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              {tasks.filter((t) => t.status === col).map((task) => (
                <div key={task.id} style={{ backgroundColor: "#121214", border: "1px solid #29292e", borderRadius: "6px", padding: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", color: "#fff", maxWidth: "80%" }}>{task.title}</h4>
                    {/* TRASH DISPOSAL BUTTON */}
                    <button onClick={() => handleDeleteTask(task.id)} style={{ background: "none", border: "none", color: "#f75a68", cursor: "pointer", fontSize: "1.1rem", padding: 0 }}>🗑️</button>
                  </div>
                  <p style={{ margin: "0 0 1rem 0", fontSize: "0.85rem", color: "#8d8d99" }}>{task.description || "No description provided."}</p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", borderTop: "1px solid #29292e", paddingTop: "0.75rem" }}>
                    <span style={{ color: "#4ade80" }}>👤 {task.assignedUser?.name || "Unassigned"}</span>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      {col !== "To Do" && <button onClick={() => handleMoveTask(task.id, col, "backward")} style={{ cursor: "pointer", border: "none", borderRadius: "3px", backgroundColor: "#29292e", color: "#fff" }}>◀</button>}
                      {col !== "Done" && <button onClick={() => handleMoveTask(task.id, col, "forward")} style={{ cursor: "pointer", border: "none", borderRadius: "3px", backgroundColor: "#29292e", color: "#fff" }}>▶</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}