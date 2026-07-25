using ChanDoanXray.DTOs;
using ChanDoanXray.Models;
using Riok.Mapperly.Abstractions;

namespace ChanDoanXray.Mappers
{
    public interface INhanVienMapper
    {
        public NhanVienDTO From(NhanVien nhanVien);
        public NhanVien From(NhanVienDTO nhanVien);
    }
    [Mapper]
    public partial class NhanVienMapper : INhanVienMapper
    {

        [MapProperty($"{nameof(User)}.{nameof(User.Email)}", nameof(NhanVienDTO.Email))]
        [MapProperty($"{nameof(User)}.{nameof(User.DiaChi)}", nameof(NhanVienDTO.DiaChi))]
        [MapProperty($"{nameof(User)}.{nameof(User.SoDienThoai)}", nameof(NhanVienDTO.SoDienThoai))]
        [MapProperty($"{nameof(User)}.{nameof(User.Username)}", nameof(NhanVienDTO.Username))]
        public partial NhanVienDTO From(NhanVien nhanVien);
        
        public partial NhanVien From(NhanVienDTO nhanVien);
    }
}
