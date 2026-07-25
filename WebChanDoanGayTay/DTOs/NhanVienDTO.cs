using ChanDoanXray.Models;
using System.Text.Json.Serialization;

namespace ChanDoanXray.DTOs
{
    public class NhanVienDTO
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("hoVaTen")]
        public string HoVaTen { get; set; }
        [JsonPropertyName("namSinh")]
        public int? NamSinh { get; set; }
        [JsonPropertyName("huy")]
        public bool? Huy { get; set; }
        [JsonPropertyName("username")]
        public string Username { get; set; }
        [JsonPropertyName("password")]
        public string Password { get; set; }
        [JsonPropertyName("email")]
        public string Email { get; set; }
        [JsonPropertyName("diaChi")]
        public string DiaChi { get; set; }
        [JsonPropertyName("soDienThoai")]
        public string SoDienThoai { get; set; }
        [JsonPropertyName("role")]
        public string Role { get; set; }
        [JsonPropertyName("ngayTao")]
        public DateTime NgayTao { get; set; }
        public User GetUserInfo()
        {
            return new User()
            {
                Username = Username,
                Password = Password,
                Email = Email,
                DiaChi = DiaChi,
                SoDienThoai = SoDienThoai
            };
        }
    }
}
