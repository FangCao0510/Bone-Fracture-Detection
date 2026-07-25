using System.Text.Json.Serialization;

namespace ChanDoanXray.DTOs
{
    public class BenhNhanViewDTO
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("maYTe")]
        public string? MaYTe { get; set; }

        [JsonPropertyName("tenBenhNhan")]
        public string? TenBenhNhan { get; set; }

        [JsonPropertyName("gioiTinh")]
        public string? GioiTinh { get; set; }

        [JsonPropertyName("ngaySinh")]
        public DateTime? NgaySinh { get; set; }

        [JsonPropertyName("soDienThoai")]
        public string? SoDienThoai { get; set; }

        [JsonPropertyName("diaChiChiTiet")]
        public string? DiaChiChiTiet { get; set; }

        [JsonPropertyName("ngayTao")]
        public DateTime? NgayTao { get; set; }

        [JsonPropertyName("nguoiTao")]
        public int? NguoiTao { get; set; }

        [JsonPropertyName("huy")]
        public bool? Huy { get; set; }
    }
    public class BenhNhanUpsertDTO
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("maYTe")]
        public string? MaYTe { get; set; }

        [JsonPropertyName("tenBenhNhan")]
        public string? TenBenhNhan { get; set; }

        [JsonPropertyName("gioiTinh")]
        public string? GioiTinh { get; set; }

        [JsonPropertyName("ngaySinh")]
        public DateTime? NgaySinh { get; set; }

        [JsonPropertyName("soDienThoai")]
        public string? SoDienThoai { get; set; }

        [JsonPropertyName("diaChiChiTiet")]
        public string? DiaChiChiTiet { get; set; }

        [JsonPropertyName("ngayTao")]
        public DateTime? NgayTao { get; set; }

        [JsonPropertyName("nguoiTao")]
        public int? NguoiTao { get; set; }

        [JsonPropertyName("huy")]
        public bool? Huy { get; set; }
    }
}
