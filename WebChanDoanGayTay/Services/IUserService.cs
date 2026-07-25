using Microsoft.EntityFrameworkCore;
using ChanDoanXray.Constants;
using ChanDoanXray.DTOs;
using ChanDoanXray.Exceptions;
using ChanDoanXray.Models;

namespace ChanDoanXray.Services
{
    public interface IUserService
    {
        User? FindUserByUsernameOrEmail(string usernameOrEmail);
        bool CheckValidUser(UserDTO userDTO);
        User GetCurrentUser();
        Role GetAvailableRole(string roleName);
        UserInfoDTO[] FindAllUserInfo();
        void UpdateCurrentUser(CurrentUserDTO currentUser);
    }
    public class UserService : IUserService
    {
        private readonly XrayContext _context;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly HttpClient _httpClient;

        public UserService(XrayContext context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri(configuration.GetValue<string>("Application:Auth:ISP"));
            this.httpContextAccessor = httpContextAccessor;
        }

        public bool CheckValidUser(UserDTO userDTO)
        {
            using var request = new HttpRequestMessage(
                HttpMethod.Post, "/api/auth");
            request.Headers.Add("username", userDTO.Username);
            request.Headers.Add("password", userDTO.Password);
            var res = _httpClient.SendAsync(request).Result;
            if (res.IsSuccessStatusCode)
            {
                return true;
            }
            // check user in NCKH App
            var user = FindUserByUsernameOrEmail(userDTO.Username);
            if (user != null && BCrypt.Net.BCrypt.Verify(userDTO.Password, user.Password))
            {
                return true;
            }

            return false;
        }

        public UserInfoDTO[] FindAllUserInfo()
        {
            using var request = new HttpRequestMessage(
                HttpMethod.Get, "/api/auth/users");
            var res = _httpClient.SendAsync(request).Result;
            if (res.IsSuccessStatusCode)
            {
                var userInfos = res.Content.ReadFromJsonAsync<UserInfoDTO[]>().Result;
                return userInfos ?? new UserInfoDTO[] { };
            }
            return new UserInfoDTO[] { };
        }

        public User? FindUserByUsernameOrEmail(string usernameOrEmail)
        {
            return _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .Where(u => u.Username == usernameOrEmail || u.Email == usernameOrEmail)
                .SingleOrDefault();
        }

        public Role GetAvailableRole(string roleName)
        {
            return _context.Roles.Where(r => r.Ten.ToLower() == roleName.ToLower()).First();
        }

        public User GetCurrentUser()
        {
            var username = httpContextAccessor.HttpContext?.User.Claims
                .Where(c => c.Type == JWTClaims.USERNAME).Select(c => c.Value)
                .SingleOrDefault();
            if (username == null)
            {
                throw new IllegalArgumentException("User is not existed in current context.");
            }
            var user = FindUserByUsernameOrEmail(username);
            if (user == null)
            {
                throw new IllegalArgumentException($"User {username} is not existed in system.");
            }
            return user;
        }
        public void UpdateCurrentUser(CurrentUserDTO currentUser)
        {
            var user = GetCurrentUser();
            user.Email = currentUser.Email;
            user.DiaChi = currentUser.DiaChi;
            user.SoDienThoai = currentUser.SoDienThoai;
            _context.Update(user);
            _context.SaveChanges();
        }
    }
}
