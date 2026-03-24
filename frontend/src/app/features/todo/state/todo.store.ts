import { Injectable, computed, signal } from '@angular/core';
import { Todo, TodoFilter } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoStore {
  readonly todos = signal<Todo[]>([]);
  readonly selectedFilter = signal<TodoFilter>('all');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly filteredTodos = computed(() => {
    const filter = this.selectedFilter();
    const all = this.todos();
    if (filter === 'active') return all.filter((item) => !item.isCompleted);
    if (filter === 'completed') return all.filter((item) => item.isCompleted);
    return all;
  });

  readonly stats = computed(() => {
    const all = this.todos();
    const completed = all.filter((item) => item.isCompleted).length;
    return { total: all.length, completed, active: all.length - completed };
  });
}
