using ChanDoanXray.DTOs;
using ChanDoanXray.Models;
using Riok.Mapperly.Abstractions;

namespace ChanDoanXray.Mappers
{
    public interface IBenhNhanMapper
    {
        public BenhNhanViewDTO ToBenhNhanViewDTO(BenhNhan benhNhan);
        public BenhNhan From(BenhNhanViewDTO benhNhanViewDTO);
    }
    [Mapper]
    public partial class BenhNhanMapper : IBenhNhanMapper
    {
    public partial BenhNhan From(BenhNhanViewDTO benhNhanViewDTO);

    public partial BenhNhanViewDTO ToBenhNhanViewDTO(BenhNhan benhNhan);

    }
}
