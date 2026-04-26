import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateTodoRequest, Todo, UpdateTodoRequest } from '../todo.types';

@Injectable({
  providedIn: 'root'
})
export class TodoApiService {
  private readonly endpoint = `${environment.apiBaseUrl}/todos`;

  private readonly mockTodos: Todo[] = [
    { id: 1, title: 'Angular 레이아웃 구성', isCompleted: true, createdAt: new Date().toISOString() },
    { id: 2, title: 'Dapper API 연동 준비', isCompleted: false, createdAt: new Date().toISOString() },
    { id: 3, title: 'Tailwind 스타일 보정', isCompleted: false, createdAt: new Date().toISOString() }
  ];

  constructor(private readonly http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    if (environment.useMockApi) {
      return of(this.mockTodos);
    }
    return this.http.get<Todo[]>(this.endpoint);
  }

  createTodo(request: CreateTodoRequest): Observable<Todo> {
    if (environment.useMockApi) {
      const next: Todo = {
        id: Date.now(),
        title: request.title,
        isCompleted: false,
        createdAt: new Date().toISOString()
      };
      this.mockTodos.unshift(next);
      return of(next);
    }
    return this.http.post<Todo>(this.endpoint, request);
  }

  updateTodo(id: number, request: UpdateTodoRequest): Observable<Todo> {
    if (environment.useMockApi) {
      const index = this.mockTodos.findIndex((todo) => todo.id === id);
      if (index < 0) {
        return throwError(() => new Error('Todo not found'));
      }
      this.mockTodos[index] = { ...this.mockTodos[index], ...request };
      return of(this.mockTodos[index]);
    }
    return this.http.patch<Todo>(`${this.endpoint}/${id}`, request);
  }

  deleteTodo(id: number): Observable<void> {
    if (environment.useMockApi) {
      const index = this.mockTodos.findIndex((todo) => todo.id === id);
      if (index >= 0) {
        this.mockTodos.splice(index, 1);
      }
      return of(void 0);
    }
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
