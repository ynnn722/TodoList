import { Injectable, computed, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { TodoApiService } from '../services/todo-api.service';
import { Todo, TodoFilter } from '../todo.types';

@Injectable({
  providedIn: 'root'
})
export class TodoFacade {
  private readonly api = inject(TodoApiService);
  private readonly snackBar = inject(MatSnackBar);

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

  setFilter(filter: TodoFilter): void {
    this.selectedFilter.set(filter);
  }

  loadTodos(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api
      .getTodos()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (todos) => this.todos.set(todos),
        error: () => {
          this.error.set('목록을 불러오지 못했습니다.');
          this.snackBar.open('목록 조회에 실패했습니다.', '닫기', { duration: 2000 });
        }
      });
  }

  createTodo(title: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.api
      .createTodo({ title })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (todo) => {
          this.todos.update((prev) => [todo, ...prev]);
          this.snackBar.open('할 일이 추가되었습니다.', '닫기', { duration: 1500 });
        },
        error: () => {
          this.error.set('할 일을 추가하지 못했습니다.');
          this.snackBar.open('할 일 추가에 실패했습니다.', '닫기', { duration: 2000 });
        }
      });
  }

  toggleTodo(id: number): void {
    const target = this.todos().find((todo) => todo.id === id);
    if (!target) return;

    this.loading.set(true);
    this.error.set(null);
    this.api
      .updateTodo(id, { isCompleted: !target.isCompleted })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (todo) => {
          this.todos.update((prev) => prev.map((item) => (item.id === id ? todo : item)));
        },
        error: () => {
          this.error.set('할 일 상태를 변경하지 못했습니다.');
          this.snackBar.open('할 일 상태 변경에 실패했습니다.', '닫기', { duration: 2000 });
        }
      });
  }

  removeTodo(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.api
      .deleteTodo(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.todos.update((prev) => prev.filter((todo) => todo.id !== id));
          this.snackBar.open('할 일이 삭제되었습니다.', '닫기', { duration: 1500 });
        },
        error: () => {
          this.error.set('할 일을 삭제하지 못했습니다.');
          this.snackBar.open('할 일 삭제에 실패했습니다.', '닫기', { duration: 2000 });
        }
      });
  }
}
