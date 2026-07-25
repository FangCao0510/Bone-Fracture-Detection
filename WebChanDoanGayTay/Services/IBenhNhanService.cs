using log4net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChanDoanXray.Constants;
using ChanDoanXray.DTOs;
using ChanDoanXray.Exceptions;
using ChanDoanXray.Mappers;
using ChanDoanXray.Models;
using ChanDoanXray.Pagination;
using ChanDoanXray.Utils;

namespace ChanDoanXray.Services
{
    public interface IBenhNhanService
    {
        public PagedList<BenhNhanViewDTO> Search(SearchParameter searchParams);
        public int Add(BenhNhanViewDTO benhNhanViewDTO);
        public int Update(int benhnhanid, BenhNhanViewDTO benhNhan);
        public BenhNhanViewDTO Get(int benhnhanid);
    }
    public class BenhNhanService : IBenhNhanService
    {
        private readonly ILog _logger = LogManager.GetLogger(typeof(BenhNhanService));
        private readonly IFileUtils _fileUtils;
        private readonly XrayContext _context;
        private readonly IBenhNhanMapper _ibenhNhanMapper;
        private readonly IUserService _userService;

        public BenhNhanService(XrayContext context,
            IBenhNhanMapper benhNhanMapper,
            IFileUtils fileUtils,
            IUserService userService)
        {
            _context = context;
            _ibenhNhanMapper = benhNhanMapper;
            _fileUtils = fileUtils;
            _userService = userService;
        }

        public int Add(BenhNhanViewDTO benhNhanViewDTO)
        {
            var now = DateTime.Now;
            var prefix = now.ToString("yyMM"); // VD: 2509 cho T9/2025

            // Tìm mã y tế lớn nhất trong tháng
            var maxMaYTe = _context.BenhNhans
                .Where(b => b.MaYTe.StartsWith(prefix))
                .OrderByDescending(b => b.MaYTe)
                .Select(b => b.MaYTe)
                .FirstOrDefault();

            int nextNumber = 1;
            if (!string.IsNullOrEmpty(maxMaYTe))
            {
                var numberPart = maxMaYTe.Substring(4);
                if (int.TryParse(numberPart, out var num))
                {
                    nextNumber = num + 1;
                }
            }

            var maYTe = $"{prefix}{nextNumber.ToString("D3")}";

            var ctdt = _ibenhNhanMapper.From(benhNhanViewDTO);
            ctdt.NgayTao = DateTime.Now;
            ctdt.MaYTe = maYTe;
            ctdt.NguoiTaoNavigation = _userService.GetCurrentUser();
            var createdBenhNhan = _context.BenhNhans.Add(ctdt);
            _context.SaveChanges();

            var tiepNhan = new TiepNhan
            {
                BenhNhanId = createdBenhNhan.Entity.Id,
                 NgayTao= DateTime.Now // nếu cần lưu ngày tiếp nhận
                 ,Huy=false
                 ,TrangThai=false
              
            };

            _context.TiepNhans.Add(tiepNhan);
            _context.SaveChanges();

            return createdBenhNhan.Entity.Id;
        }

        public BenhNhanViewDTO Get(int BenhNhanid)
        {
            var ctdt = _context.BenhNhans
                .Where(c => c.Id == BenhNhanid)
                .SingleOrDefault();
            if (ctdt == null)
            {
                throw new IllegalArgumentException("Chương trình đào tạo không tồn tại.");
            }
            return _ibenhNhanMapper.ToBenhNhanViewDTO(ctdt);
        }

        public PagedList<BenhNhanViewDTO> Search(SearchParameter searchParams)
        {
            //var ctdtPage = PagedList<BenhNhanViewDTO>.ToPagedList(_context.BenhNhans.Select(d => _ibenhNhanMapper.ToBenhNhanViewDTO(d)), searchParams.PageNumber, searchParams.PageSize);
            //_logger.Info($"Page '{ctdtPage.CurrentPage}' with '{ctdtPage.PageSize}' Chuong Trinh Dao Tao has been returned.");
            var query = _context.BenhNhans.AsQueryable();
            if (!string.IsNullOrWhiteSpace(searchParams.TenBenhNhan))
            {
                query = query.Where(b => b.TenBenhNhan != null && b.TenBenhNhan.ToLower().Contains(searchParams.TenBenhNhan.ToLower()));
            }
            if (searchParams.FromDate != null)
            {
                var fromDate = searchParams.FromDate.Value.Date;
                query = query.Where(b => b.NgayTao >= fromDate);
            }
            if (searchParams.ToDate != null)
            {
                var toDate = searchParams.ToDate.Value.Date.AddDays(1);
                query = query.Where(b => b.NgayTao < toDate);
            }
            query = query.OrderByDescending(b => b.NgayTao);
            var ctdtPage = PagedList<BenhNhanViewDTO>.ToPagedList(
                query.Select(d => _ibenhNhanMapper.ToBenhNhanViewDTO(d)),
                searchParams.PageNumber,
                searchParams.PageSize);
            _logger.Info($"Page '{ctdtPage.CurrentPage}' with '{ctdtPage.PageSize}' benh nhan has been returned.");
            return ctdtPage;
        }

        public int Update(int benhnhanid, BenhNhanViewDTO benhnhan)
        {
            var ctdt = _context.BenhNhans
                .Where(d => d.Id == benhnhanid)
                .SingleOrDefault();
            if (ctdt == null)
            {
                throw new IllegalArgumentException("tiếp nhân không tồn tại.");
            }
            var updateCTDT = _ibenhNhanMapper.From(benhnhan);
            if (updateCTDT.Id != ctdt.Id)
            {
                throw new IllegalArgumentException("Dữ liệu bệnh nhân không khớp.");
            }
            ctdt.TenBenhNhan = updateCTDT.TenBenhNhan;
            ctdt.NgaySinh = updateCTDT.NgaySinh;
            ctdt.GioiTinh = updateCTDT.GioiTinh;
            ctdt.DiaChiChiTiet = updateCTDT.DiaChiChiTiet;
            _context.BenhNhans.Update(ctdt);
            _context.SaveChanges();
            return benhnhanid;
        }
    }
}
