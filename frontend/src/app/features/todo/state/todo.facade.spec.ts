/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Todo } from '../todo.types';
import { TodoApiService } from '../services/todo-api.service';
import { TodoFacade } from './todo.facade';

describe('TodoFacade', () => {
  let facade: TodoFacade;
  let apiSpy: jasmine.SpyObj<TodoApiService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const initialTodos: Todo[] = [
    { id: 1, title: 'one', isCompleted: false, createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 2, title: 'two', isCompleted: true, createdAt: '2026-01-02T00:00:00.000Z' }
  ];

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj<TodoApiService>('TodoApiService', ['getTodos', 'createTodo', 'updateTodo', 'deleteTodo']);
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        TodoFacade,
        { provide: TodoApiService, useValue: apiSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    facade = TestBed.inject(TodoFacade);
  });

  it('loads todos successfully', () => {
    apiSpy.getTodos.and.returnValue(of(initialTodos));

    facade.loadTodos();

    expect(facade.todos()).toEqual(initialTodos);
    expect(facade.loading()).toBeFalse();
    expect(facade.error()).toBeNull();
  });

  it('updates filteredTodos when filter changes', () => {
    apiSpy.getTodos.and.returnValue(of(initialTodos));
    facade.loadTodos();

    facade.setFilter('active');
    expect(facade.filteredTodos()).toEqual([initialTodos[0]]);

    facade.setFilter('completed');
    expect(facade.filteredTodos()).toEqual([initialTodos[1]]);
  });

  it('creates and prepends new todo', () => {
    const nextTodo: Todo = { id: 3, title: 'three', isCompleted: false, createdAt: '2026-01-03T00:00:00.000Z' };
    apiSpy.getTodos.and.returnValue(of(initialTodos));
    apiSpy.createTodo.and.returnValue(of(nextTodo));
    facade.loadTodos();

    facade.createTodo('three');

    expect(facade.todos()[0]).toEqual(nextTodo);
    expect(snackBarSpy.open).toHaveBeenCalledWith('할 일이 추가되었습니다.', '닫기', { duration: 1500 });
  });

  it('handles load failure with user-friendly error', () => {
    apiSpy.getTodos.and.returnValue(throwError(() => new Error('boom')));

    facade.loadTodos();

    expect(facade.error()).toBe('목록을 불러오지 못했습니다.');
    expect(snackBarSpy.open).toHaveBeenCalledWith('목록 조회에 실패했습니다.', '닫기', { duration: 2000 });
  });
});
