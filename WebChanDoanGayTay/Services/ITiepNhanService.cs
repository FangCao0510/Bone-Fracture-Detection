using log4net;
using Microsoft.EntityFrameworkCore;
using ChanDoanXray.DTOs;
using ChanDoanXray.Exceptions;
using ChanDoanXray.Mappers;
using ChanDoanXray.Models;
using ChanDoanXray.Pagination;

namespace ChanDoanXray.Services
{
    public interface ITiepNhanService
    {
        public TiepNhanDTO Add(TiepNhanDTO tiepNhan);
        public PagedList<TiepNhanDTO> Search(SearchParameter searchParams);
        public IEnumerable<TiepNhanDTO> Get();
        public TiepNhanDTO Get(int TiepNhanid);

    }
    public class TiepNhanService : ITiepNhanService
    {
        private readonly ILog _logger = LogManager.GetLogger(typeof(TiepNhanService));
        private readonly XrayContext _context;
        private readonly ITiepNhanMapper _tiepNhanMapper;

        public TiepNhanService(XrayContext context,
            ITiepNhanMapper tiepNhanMapper)
        {
            _tiepNhanMapper = tiepNhanMapper;
            _context = context;
        }

        public TiepNhanDTO Add(TiepNhanDTO tiepNhanDTO)
        {
            var tiepNhan = _tiepNhanMapper.From(tiepNhanDTO);
            var entity = _context.Add(tiepNhan);
            _context.SaveChanges();
            var tiepNhan1 = _context.TiepNhans
                .Include(l => l.BenhNhan)
                .Where(l => l.Id == entity.Entity.Id)
                .First();
            return _tiepNhanMapper.To(tiepNhan1);
        }
        public IEnumerable<TiepNhanDTO> Get()
        {
            var tiepNhans = _context.TiepNhans
                .Include(tn => tn.BenhNhan)
                .Include(tn => tn.LinkFiles) // nếu là navigation property dạng ICollection<LinkFile>
                .Where(tn => tn.BenhNhanId != null)
                .ToList();

            foreach (var tn in tiepNhans)
            {
                if (tn.TrangThai == null) tn.TrangThai = false;
            }

            return tiepNhans.Select(tn => _tiepNhanMapper.To(tn));
        }
        public TiepNhanDTO Get(int tiepnhanid)
        {
            //var tiepNhan = _context.TiepNhans
            //    .Include(l => l.BenhNhan)
            //    .FirstOrDefault(l => l.BenhNhanId != null && l.Id == tiepnhanid);

            //if (tiepNhan == null)
            //{
            //    return null; // hoặc throw NotFoundException nếu muốn
            //}

            //// Nếu TrangThai là nullable (bool?), gán mặc định nếu cần
            //if (tiepNhan.TrangThai == null)
            //{
            //    tiepNhan.TrangThai = false;
            //}
            var tiepNhans = _context.TiepNhans
                .Include(tn => tn.BenhNhan)
                .Include(tn => tn.LinkFiles) // nếu là navigation property dạng ICollection<LinkFile>
                .FirstOrDefault(l => l.BenhNhanId != null && l.Id == tiepnhanid);
            if (tiepNhans == null)
            {
                return null; // hoặc throw NotFoundException nếu muốn
            }
            if (tiepNhans.TrangThai==null)
            {
                tiepNhans.TrangThai = false;
            }
            return _tiepNhanMapper.To(tiepNhans);
        }
        public PagedList<TiepNhanDTO> Search(SearchParameter searchParams)
        {
            var TiepNhanPage = PagedList<TiepNhanDTO>.ToPagedList(_context.TiepNhans
                .Include(l => l.BenhNhan)
                .Select(l => _tiepNhanMapper.To(l))
                , searchParams.PageNumber, searchParams.PageSize);
            _logger.Info($"Page '{TiepNhanPage.CurrentPage}' with '{TiepNhanPage.PageSize}' Lop Hoc has been returned.");
            return TiepNhanPage;
        }
    }
}
