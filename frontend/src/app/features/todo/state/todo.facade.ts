import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { TodoApiService } from '../services/todo-api.service';
import { TodoFilter } from '../models/todo.model';
import { TodoStore } from './todo.store';

@Injectable({
  providedIn: 'root'
})
export class TodoFacade {
  private readonly api = inject(TodoApiService);
  private readonly store = inject(TodoStore);
  private readonly snackBar = inject(MatSnackBar);

  readonly todos = this.store.todos;
  readonly selectedFilter = this.store.selectedFilter;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly filteredTodos = this.store.filteredTodos;
  readonly stats = this.store.stats;

  setFilter(filter: TodoFilter): void {
    this.store.selectedFilter.set(filter);
  }

  loadTodos(): void {
    this.store.loading.set(true);
    this.store.error.set(null);
    this.api
      .getTodos()
      .pipe(finalize(() => this.store.loading.set(false)))
      .subscribe({
        next: (todos) => this.store.todos.set(todos),
        error: () => {
          this.store.error.set('목록을 불러오지 못했습니다.');
          this.snackBar.open('목록 조회에 실패했습니다.', '닫기', { duration: 2000 });
        }
      });
  }

  createTodo(title: string): void {
    this.store.loading.set(true);
    this.store.error.set(null);
    this.api
      .createTodo({ title })
      .pipe(finalize(() => this.store.loading.set(false)))
      .subscribe({
        next: (todo) => {
          this.store.todos.update((prev) => [todo, ...prev]);
          this.snackBar.open('할 일이 추가되었습니다.', '닫기', { duration: 1500 });
        },
        error: () => {
          this.store.error.set('할 일을 추가하지 못했습니다.');
          this.snackBar.open('할 일 추가에 실패했습니다.', '닫기', { duration: 2000 });
        }
      });
  }

  toggleTodo(id: number): void {
    const target = this.store.todos().find((todo) => todo.id === id);
    if (!target) return;

    this.store.loading.set(true);
    this.store.error.set(null);
    this.api
      .updateTodo(id, { isCompleted: !target.isCompleted })
      .pipe(finalize(() => this.store.loading.set(false)))
      .subscribe({
        next: (todo) => {
          this.store.todos.update((prev) => prev.map((item) => (item.id === id ? todo : item)));
        },
        error: () => {
          this.store.error.set('할 일 상태를 변경하지 못했습니다.');
          this.snackBar.open('할 일 상태 변경에 실패했습니다.', '닫기', { duration: 2000 });
        }
      });
  }

  removeTodo(id: number): void {
    this.store.loading.set(true);
    this.store.error.set(null);
    this.api
      .deleteTodo(id)
      .pipe(finalize(() => this.store.loading.set(false)))
      .subscribe({
        next: () => {
          this.store.todos.update((prev) => prev.filter((todo) => todo.id !== id));
          this.snackBar.open('할 일이 삭제되었습니다.', '닫기', { duration: 1500 });
        },
        error: () => {
          this.store.error.set('할 일을 삭제하지 못했습니다.');
          this.snackBar.open('할 일 삭제에 실패했습니다.', '닫기', { duration: 2000 });
        }
      });
  }
}
