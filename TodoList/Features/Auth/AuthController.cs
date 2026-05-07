using Microsoft.AspNetCore.Mvc;
using TodoList.Features.Auth.Contracts;

namespace TodoList.Features.Auth;

[ApiController]
[Route("api/[controller]")] // api/auth
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("login")]
    public ActionResult<LoginResponse> Login([FromBody] LoginRequest request)
    {
        var userId = request.UserId?.Trim() ?? string.Empty;
        var password = request.Password ?? string.Empty;

        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(password))
        {
            return BadRequest("아이디와 비밀번호는 필수입니다.");
        }

        var demoUserId = _configuration["Auth:DemoUserId"];
        var demoPassword = _configuration["Auth:DemoPassword"];

        if (string.IsNullOrWhiteSpace(demoUserId) || string.IsNullOrWhiteSpace(demoPassword))
        {
            return Ok(new LoginResponse { Success = false });
        }

        var success =
            string.Equals(userId, demoUserId, StringComparison.Ordinal) &&
            string.Equals(password, demoPassword, StringComparison.Ordinal);

        return Ok(new LoginResponse { Success = success });
    }
}

