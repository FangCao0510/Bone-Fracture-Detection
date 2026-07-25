namespace ChanDoanXray.DTOs
{
    public class UserDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }

        public UserDTO(string username, string password)
        {
            Username = username;
            Password = password;
        }
        public UserDTO() { }
    }
    public class CurrentUserDTO
    {
        public string Username { get; set;}
        public string Email { get; set;}
        public string DiaChi { get; set; }
        public string SoDienThoai { get; set; }
        public string[]? Roles { get; set; }

        public CurrentUserDTO(string username, string email, string diaChi, string soDienThoai, string[] roles)
        {
            Username = username;
            Email = email;
            DiaChi = diaChi;
            SoDienThoai = soDienThoai;
            Roles = roles;
        }

        public CurrentUserDTO()
        {
        }
    }
    public class UserInfoDTO
    {
        public string Username { get; set;}
        public string Fullname { get; set;}
    }
}
