namespace QuanLyDaoTao.DTOs
{
    public class CauHinhDTO
    {
        public int? Id { get; set; }
        public string Ten { get; set; }
        public string Ma { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime NgayCapNhat { get; set; }
        public bool? Huy { get; set; }
    }
}
