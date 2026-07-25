using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ChanDoanXray.Attributes;
using ChanDoanXray.Constants;
using ChanDoanXray.DTOs;
using ChanDoanXray.Mappers;
using ChanDoanXray.Models;
using ChanDoanXray.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChanDoanXray.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthControllerAPI : ControllerBase
    {
        private IConfiguration _config;
        private IUserService _userService;
        private IUserMapper _userMapper;
        private readonly string _secretKey;
        private readonly string _issuer;
        public AuthControllerAPI(IConfiguration config,
            IUserService userService,
            IUserMapper userMapper)
        {
            _config = config;
            _userService = userService;
            _userMapper = userMapper;
            _secretKey = _config["Application:Auth:SecretKey"];
            _issuer = _config["Application:Auth:Issuer"];
        }
        [HttpPost]
        [AllowAnonymous]
        [Route("login")]
        public IActionResult Login([FromBody] UserDTO model)
        {
            var user = AuthenticateUser(model);
            if (user == null)
            {
                return Unauthorized();
            }
            return Ok(new { token = GenerateJSONWebToken(user) });
        }

        [HttpGet]
        [Authorization("RoleBasedPolicy")]
        [Route("current-user")]
        public IActionResult CurrentUser()
        {
            var username = HttpContext.User.Claims.Where(c => c.Type == JWTClaims.USERNAME).Select(c => c.Value).SingleOrDefault();
            if (username == null)
            {
                return BadRequest(new { Message = "Không tìm thấy người dùng trong hệ thống" });
            }
            var user = _userService.FindUserByUsernameOrEmail(username);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(_userMapper.From(user));
        }

        [HttpGet]
        [Authorization("RoleBasedPolicy", "ADMIN,USER")]
        [Route("users")]
        public IActionResult Users()
        {
            return Ok(_userService.FindAllUserInfo());
        }

        private string GenerateJSONWebToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var roles = $"[{string.Join(",", user.UserRoles.Select(ur => $"\"{ur.Role.Ten}\"").ToArray())}]";
            var claims = new[] {
                new Claim(JWTClaims.USERNAME, user.Username),
                new Claim(JWTClaims.ROLES, roles, JsonClaimValueTypes.JsonArray)
            };
            var token = new JwtSecurityToken(_issuer,
              _issuer,
              claims,
              expires: DateTime.Now.AddDays(1),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private User? AuthenticateUser(UserDTO login)
        {
            var isValidUser = _userService.CheckValidUser(login);
            if (isValidUser)
            {
                return _userService.FindUserByUsernameOrEmail(login.Username);
            }
            return null;
        }
        [HttpPut]
        [Authorization("RoleBasedPolicy", "ADMIN,USER")]
        [Route("current-user")]
        public IActionResult UpdateCurrentUser([FromBody] CurrentUserDTO currentUser)
        {
            var username = HttpContext.User.Claims.Where(c => c.Type == JWTClaims.USERNAME).Select(c => c.Value).SingleOrDefault();
            if (username == null)
            {
                return Unauthorized();
            }
            if (!string.Equals(username, currentUser.Username, StringComparison.OrdinalIgnoreCase))
            {
                return Forbid();
            }
            _userService.UpdateCurrentUser(currentUser);
            return Ok();
        }
    }
}
