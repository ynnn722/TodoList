export interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
  createdAt: string;
}

export type TodoFilter = 'all' | 'active' | 'completed';

export interface CreateTodoRequest {
  title: string;
}

export interface UpdateTodoRequest {
  title?: string;
  isCompleted?: boolean;
}
