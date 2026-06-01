export interface User {
  id: number;
  name: string;
  email: string;
}

export interface BoardTask {
  id: number;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  userId: number;
  assignedUser?: User; // Optional object linked from relational join
}