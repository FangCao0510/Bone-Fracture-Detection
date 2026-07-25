using ChanDoanXray.DTOs;
using ChanDoanXray.Exceptions;
using ChanDoanXray.Models;
using Riok.Mapperly.Abstractions;

namespace ChanDoanXray.Mappers
{
    public interface ITiepNhanMapper
    {
        public TiepNhanViewDTO ToTiepNhanViewDTO(TiepNhan tiepNhan);
        public TiepNhan From(TiepNhanDTO tiepNhanDTO);
        public TiepNhanDTO To(TiepNhan tiepNhan);
    }
    [Mapper]
    public partial class TiepNhanMapper : ITiepNhanMapper
    {
        private readonly ILinkFileMapper _linkFileMapper;
        public TiepNhanMapper(ILinkFileMapper linkFileMapper)
        {
            _linkFileMapper = linkFileMapper;
        }

        [MapProperty(nameof(TiepNhanDTO.LinkFiles), nameof(TiepNhan.LinkFiles), Use = nameof(MapToListTaiLieu))]
        public partial TiepNhan From(TiepNhanDTO tiepNhanDTO);

        public partial TiepNhanViewDTO ToTiepNhanViewDTO(TiepNhan tiepNhan);
        public partial TiepNhanDTO To(TiepNhan tiepNhan);

        private ICollection<LinkFile> MapToListTaiLieu(List<LinkFileEditDTO>? source)
        {
            if (source == null)
            {
                return new List<LinkFile>();
            }
            var target = new List<LinkFile>(source.Count);
            foreach (var item in source)
            {
                target.Add(_linkFileMapper.From(item));
            }
            return target;
        }
    }
}
