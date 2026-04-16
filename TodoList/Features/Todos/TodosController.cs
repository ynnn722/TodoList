using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoList.Data;
using TodoList.Data.Entities;
using TodoList.Features.Todos.Contracts;

namespace TodoList.Features.Todos;

[ApiController]
[Route("api/[controller]")] // api/todos
public class TodosController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public TodosController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<TodoResponse>>> GetTodos()
    {
        var todos = await _dbContext.Todos
            .OrderByDescending(x => x.Id)
            .Select(x => new TodoResponse
            {
                Id = x.Id,
                Title = x.Title,
                IsCompleted = x.IsCompleted,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();

        return Ok(todos);
    }

    [HttpPost]
    public async Task<ActionResult<TodoResponse>> CreateTodo([FromBody] CreateTodoRequest request)
    {
        var title = request.Title?.Trim();

        if (string.IsNullOrWhiteSpace(title))
        {
            return BadRequest("제목은 필수입니다.");
        }

        if (title.Length > 120)
        {
            return BadRequest("제목은 120자를 초과할 수 없습니다.");
        }

        var todo = new Todo
        {
            Title = title,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Todos.Add(todo);
        await _dbContext.SaveChangesAsync();

        var response = new TodoResponse
        {
            Id = todo.Id,
            Title = todo.Title,
            IsCompleted = todo.IsCompleted,
            CreatedAt = todo.CreatedAt
        };

        return Ok(response);
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<TodoResponse>> UpdateTodo(int id, [FromBody] UpdateTodoRequest request)
    {
        var todo = await _dbContext.Todos.FindAsync(id);

        if (todo is null)
        {
            return NotFound();
        }

        if (request.Title is not null)
        {
            var title = request.Title.Trim();

            if (string.IsNullOrWhiteSpace(title))
            {
                return BadRequest("제목은 비워둘 수 없습니다.");
            }

            if (title.Length > 120)
            {
                return BadRequest("제목은 120자를 초과할 수 없습니다.");
            }

            todo.Title = title;
        }

        if (request.IsCompleted.HasValue)
        {
            todo.IsCompleted = request.IsCompleted.Value;
        }

        await _dbContext.SaveChangesAsync();

        var response = new TodoResponse
        {
            Id = todo.Id,
            Title = todo.Title,
            IsCompleted = todo.IsCompleted,
            CreatedAt = todo.CreatedAt
        };

        return Ok(response);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTodo(int id)
    {
        var todo = await _dbContext.Todos.FindAsync(id);

        if (todo is null)
        {
            return NotFound();
        }

        _dbContext.Todos.Remove(todo);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}