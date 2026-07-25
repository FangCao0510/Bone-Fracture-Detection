using Microsoft.AspNetCore.Http;
using ChanDoanXray.DTOs;
using ChanDoanXray.Models;
using ChanDoanXray.Utils;
using Riok.Mapperly.Abstractions;

namespace ChanDoanXray.Mappers
{
    public interface ILinkFileMapper
    {
        public LinkFileDTO From(LinkFile linkfile);
        public LinkFile From(LinkFileEditDTO linkfileEditDTO);
    }
    [Mapper]
    public partial class LinkFileMapper : ILinkFileMapper
    {
        private readonly IFileUtils _fileUtils;
        public LinkFileMapper(IFileUtils fileUtils)
        {
            _fileUtils = fileUtils;
        }
        public partial LinkFileDTO From(LinkFile Linkfile);

        [MapProperty(nameof(linkFileEditDTO.FileGoc), nameof(LinkFile.DuongDanGoc), Use = nameof(MapDuongDan))]
        [MapProperty(nameof(linkFileEditDTO.FileGoc), nameof(LinkFile.FilenameGoc), Use = nameof(MapFilename))]
        [MapProperty(nameof(linkFileEditDTO.FileChanDOan), nameof(LinkFile.DuongDanChanDoan), Use = nameof(MapDuongDan))]
        [MapProperty(nameof(linkFileEditDTO.FileChanDOan), nameof(LinkFile.FilenameChanDoan), Use = nameof(MapFilename))]
        public partial LinkFile From(LinkFileEditDTO linkFileEditDTO);

        [UserMapping]
        private string MapDuongDan(IFormFile file)
        {
            if (file.Length > 0)
            {
                var fileName = _fileUtils.Upload(file);
                return fileName;

            }
            return string.Empty;
        }

        [UserMapping]
        private string MapFilename(IFormFile file)
        {
            return file.FileName;
        }
    }
}
