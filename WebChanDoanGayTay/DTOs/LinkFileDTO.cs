using ChanDoanXray.Models;

namespace ChanDoanXray.DTOs
{
    public class LinkFileUploadDTO
    {
        public IFormFile File { get; set; }
        public string Loai { get; set; }
        public LinkFileUploadDTO() { }
    }
    public class LinkFileDTO
    {
        public int Id { get; set; }
        public string DuongDanGoc { get; set; }
        public string FilenameGoc { get; set; }
        public string Loai { get; set; }
        public bool? Huy { get; set; }
        public string DuongDanChanDoan { get; set; }
        public string FilenameChanDoan { get; set; }
        public string chanDoan { get; set; }

        public LinkFileDTO(LinkFile linkfile)
        {
            Id = linkfile.Id;
            DuongDanGoc = linkfile.DuongDanGoc;
            FilenameGoc = linkfile.FilenameGoc;
            Huy = linkfile.Huy;
            Loai = linkfile.Loai;
            DuongDanChanDoan = linkfile.DuongDanChanDoan;
            FilenameChanDoan = linkfile.FilenameChanDoan;
            chanDoan = linkfile.chanDoan;
        }
        public LinkFileDTO() { }
    }
    public class LinkFileEditDTO
    {
        public int Id { get; set; }
        public string? DuongDanGoc { get; set; }
        public string Loai { get; set; }
        public bool? Huy { get; set; }
        public IFormFile FileGoc { get; set; }
        public string? DuongDanChanDoan { get; set; }
        public IFormFile FileChanDOan { get; set; }

        public string chanDoan { get; set; }
    }
}
