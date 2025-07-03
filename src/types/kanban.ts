export type Priority = "Low" | "Medium" | "High"

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  date: string
  status: "not-started" | "completed" | "approved"
}

export interface Column {
  id: string
  title: string
  tasks: Task[]
  bgColor: string
}

