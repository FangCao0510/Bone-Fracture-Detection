using ExcelDataReader;
using log4net;
using Microsoft.EntityFrameworkCore;
using NghienCuuKhoaHoc.Constants;
using ChanDoanXray.DTOs;
using ChanDoanXray.Exceptions;
using ChanDoanXray.Mappers;
using ChanDoanXray.Models;
using ChanDoanXray.Pagination;
using System.Collections.ObjectModel;

namespace ChanDoanXray.Services
{
    public interface INhanVienService
    {
        public PagedList<NhanVienDTO> SearchNhanVien(SearchParameter searchParams);
        public int Add(NhanVienDTO nhanVienDTO);
        public void Update(int nhanVienId, NhanVienDTO nhanVienDTO);
        public PagedList<NhanVienDTO> Search(SearchParameter searchParams);
        public List<NhanVienDTO> Import(IFormFile templateData);
    }
    public class NhanVienService : INhanVienService
    {
        private readonly ILog _logger = LogManager.GetLogger(typeof(NhanVienService));
        private readonly XrayContext _context;
        private readonly INhanVienMapper _mapper;
        private readonly IUserService _userService;

        public NhanVienService(XrayContext context,
            INhanVienMapper nhanVienMapper,
            IUserService userService)
        {
            _context = context;
            _mapper = nhanVienMapper;
            _userService = userService;
        }

        public int Add(NhanVienDTO nhanVienDTO)
        {
            var nhanVien = _mapper.From(nhanVienDTO);
            var user = nhanVienDTO.GetUserInfo();
            var userByUsername = _userService.FindUserByUsernameOrEmail(user.Username);
            if (userByUsername != null)
            {
                throw new IllegalArgumentException("Tài khoản đã tồn tại.");
            }
            var userByEmail = _userService.FindUserByUsernameOrEmail(user.Email);
            if (userByEmail != null)
            {
                throw new IllegalArgumentException("Email đã tồn tại.");
            }
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            nhanVien.User = user;
            nhanVien.NgayTao = DateTime.Now;
            var userRole = new UserRole();
            userRole.User = user;
            var role = _userService.GetAvailableRole(nhanVienDTO.Role);
            userRole.Role = role != null ? role : new Role() { Ten =  nhanVienDTO.Role };
            nhanVien.User.UserRoles.Add(userRole);
            var addedNhanVien = _context.NhanViens.Add(nhanVien);
            _context.SaveChanges();
            return addedNhanVien.Entity.Id;
        }

        public List<NhanVienDTO> Import(IFormFile templateData)
        {
            var nhanViens = Extract(templateData.OpenReadStream());
            foreach (var nhanVien in nhanViens)
            {
                var user = nhanVien.User;
                var userByUsername = _userService.FindUserByUsernameOrEmail(user.Username);
                if (userByUsername != null)
                {
                    throw new IllegalArgumentException($"Tài khoản {user.Username} đã tồn tại.");
                }
                var userByEmail = _userService.FindUserByUsernameOrEmail(user.Email);
                if (userByEmail != null)
                {
                    throw new IllegalArgumentException($"Email {user.Email} đã tồn tại.");
                }
            }

            _context.AddRange(nhanViens);
            _context.SaveChanges();
            return nhanViens.Select(_mapper.From)
                .ToList();
        }

        public PagedList<NhanVienDTO> Search(SearchParameter searchParams)
        {
            var nhanVienPage = PagedList<NhanVienDTO>.ToPagedList(_context.NhanViens
                .Include(n => n.User)
                .Select(n => _mapper.From(n))
                , searchParams.PageNumber, searchParams.PageSize);
            _logger.Info($"Page '{nhanVienPage.CurrentPage}' with '{nhanVienPage.PageSize}' Nhan Vien has been returned.");
            return nhanVienPage;
        }

        public PagedList<NhanVienDTO> SearchNhanVien(SearchParameter searchParams)
        {
            var nhanVienPage = PagedList<NhanVienDTO>.ToPagedList(_context.NhanViens.Include(n => n.User).Select(n => _mapper.From(n)), searchParams.PageNumber, searchParams.PageSize);
            _logger.Info($"Page '{nhanVienPage.CurrentPage}' with size '{nhanVienPage.PageSize}' has been returned.");
            return nhanVienPage;
        }

        public void Update(int nhanVienId, NhanVienDTO nhanVienDTO)
        {
            var currentNhanVien = _context.NhanViens
                .Include(n => n.User)
                .Where(n => n.Id == nhanVienId)
                .SingleOrDefault();
            if (currentNhanVien == null)
            {
                throw new IllegalArgumentException($"Nhan Vien with id {nhanVienId} does not exist.");
            }
            if (nhanVienDTO.Username != currentNhanVien.User.Username)
            {
                throw new IllegalArgumentException($"Cannot change username {nhanVienDTO.Username} of Nhan Vien with id {nhanVienId}.");
            }
            var nhanVien = _mapper.From(nhanVienDTO);
            // ngayTao is overrided by null since user usually does not input this value. So we have to reset.
            nhanVien.NgayTao = currentNhanVien.NgayTao;
            nhanVien.UserId = currentNhanVien.UserId;
            nhanVien.Id = currentNhanVien.Id;
            nhanVien.User = new User()
            {
                Id = currentNhanVien.User.Id,
                Email = nhanVienDTO.Email,
                DiaChi = nhanVienDTO.DiaChi,
                Password = BCrypt.Net.BCrypt.HashPassword(nhanVienDTO.Password),
                Username = currentNhanVien.User.Username,
                SoDienThoai = nhanVienDTO.SoDienThoai
            };
            _context.Entry(currentNhanVien).CurrentValues.SetValues(nhanVien);
            _context.Entry(currentNhanVien.User).CurrentValues.SetValues(nhanVien.User);
            _context.Update(currentNhanVien);
            _context.SaveChanges();
        }
		private Collection<NhanVien> Extract(Stream stream)
        {
            var nhanViens = new Collection<NhanVien>();
            var index = 1;
            using (var reader = ExcelReaderFactory.CreateReader(stream))
            {
                while (reader.Read())
                {
                    if (index < 2)
                    {
                        index++;
                        continue;
                    }
                    if (index == 2)
                    {
                        VerifyHeader(reader);
                        index++;
                        continue;
                    }
                    var stt = reader.GetValue((int)NhanVienTemplateCol.STT);
                    // ignore row not having STT
                    if (stt == null)
                    {
                        continue;
                    }
                    var password = reader.GetString((int)NhanVienTemplateCol.PASSWORD);
                    var hash = password != null
                        ? BCrypt.Net.BCrypt.HashPassword(password)
                        : null;
                    var user = new User()
                    {
                        Username = reader.GetString((int)NhanVienTemplateCol.USERNAME),
                        SoDienThoai = FormatPhoneNumber(reader.GetDouble((int)NhanVienTemplateCol.SO_DIEN_THOAI)),
                        Email = reader.GetString((int)NhanVienTemplateCol.EMAIL),
                        DiaChi = reader.GetString((int)NhanVienTemplateCol.DIA_CHI),
                        Password = hash
                    };


                    var nhanVien = new NhanVien()
                    {
                        HoVaTen = reader.GetString((int)NhanVienTemplateCol.HO_VA_TEN),
                        NamSinh = (int)reader.GetDouble((int)NhanVienTemplateCol.NAM_SINH),
                        User = user
                    };
                    var role = reader.GetString((int)NhanVienTemplateCol.VAI_TRO);
                    var availableRole = _userService.GetAvailableRole(role);
                    var userRole = new UserRole()
                    {
                        User = user
                    };
                    userRole.Role = availableRole != null ? availableRole : new Role() { Ten = role };
                    nhanVien.User.UserRoles.Add(userRole);
                    nhanVien.NgayTao = DateTime.Now;
                    nhanViens.Add(nhanVien);
                    index++;
                }
            }
            return nhanViens;
        }

        private string FormatPhoneNumber(double v)
        {
            return v.ToString("0#########");
        }

        private void VerifyHeader(IExcelDataReader reader)
        {
            var stt = reader.GetString((int)NhanVienTemplateCol.STT);
            var hoVaTen = reader.GetString((int)NhanVienTemplateCol.HO_VA_TEN);
            var namSinh = reader.GetString((int)NhanVienTemplateCol.NAM_SINH);
            var sdt = reader.GetString((int)NhanVienTemplateCol.SO_DIEN_THOAI);
            var email = reader.GetString((int)NhanVienTemplateCol.EMAIL);
            var username = reader.GetString((int)NhanVienTemplateCol.USERNAME);
            var password = reader.GetString((int)NhanVienTemplateCol.PASSWORD);
            var diaChi = reader.GetString((int)NhanVienTemplateCol.DIA_CHI);
            var vaiTro = reader.GetString((int)NhanVienTemplateCol.VAI_TRO);
            if (stt != "STT")
            {
                throw new IllegalArgumentException("Sai định dạng của mẫu Excel: STT nằm không đúng vị trí.");
            }
            if (hoVaTen != "Họ và tên")
            {
                throw new IllegalArgumentException("Sai định dạng của mẫu Excel: Họ Và Tên nằm không đúng vị trí.");
            }
            if (namSinh != "Năm sinh")
            {
                throw new IllegalArgumentException("Sai định dạng của mẫu Excel: Năm Sinh nằm không đúng vị trí.");
            }
            if (sdt != "Số điện thoại")
            {
                throw new IllegalArgumentException("Sai định dạng của mẫu Excel: Số Điện Thoại nằm không đúng vị trí.");
            }
            if (email != "Email")
            {
                throw new IllegalArgumentException("Sai định dạng của mẫu Excel: Email nằm không đúng vị trí.");
            }
            if (username != "Username")
            {
                throw new IllegalArgumentException("Sai định dạng của mẫu Excel: Username nằm không đúng vị trí.");
            }
            if (password != "Mật khẩu")
            {
                throw new IllegalArgumentException("Sai định dạng của mẫu Excel: Mật Khẩu nằm không đúng vị trí.");
            }
            if (diaChi != "Địa chỉ")
            {
                throw new IllegalArgumentException("Sai định dạng của mẫu Excel: Địa Chỉ nằm không đúng vị trí.");
            }
            if (vaiTro != "Vai trò")
            {
                throw new IllegalArgumentException("Sai định dạng của mẫu Excel: Vai Trò nằm không đúng vị trí.");
            }
        }
    }
}
