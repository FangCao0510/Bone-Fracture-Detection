using System.Text.Json.Serialization;

namespace ChanDoanXray.DTOs
{
    public class TiepNhanDTO
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("BenhNhanId")]
        public int? BenhNhanId { get; set; }
        [JsonPropertyName("TrangThai")]
        public bool? TrangThai { get; set; }
        public List<LinkFileDTO>? LinkFiles { get; set; }
        [JsonPropertyName("benhNhan")]
        public BenhNhanViewDTO? BenhNhan { get; set; }
    }
    public class TiepNhanViewDTO
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("BenhNhanId")]
        public int? BenhNhanId { get; set; }
        public ICollection<LinkFileDTO> LinkFiles { get; set; }


    }

}
