using log4net;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using ChanDoanXray.Attributes;
using ChanDoanXray.DTOs;
using ChanDoanXray.Mappers;
using ChanDoanXray.Pagination;
using ChanDoanXray.Services;
using System.Text.Json;

namespace ChanDoanXray.Controllers
{
    [Route("api/nhan-vien")]
    [ApiController]
    [Authorization("RoleBasedPolicy", "USER,ADMIN")]
    public class NhanVienControllerAPI : ControllerBase
    {
        private readonly INhanVienService _nhanVienService;
        private readonly ILog _logger = LogManager.GetLogger(typeof(NhanVienControllerAPI));
        public NhanVienControllerAPI(INhanVienService nhanVienService)
        {
            _nhanVienService = nhanVienService;
        }
        [HttpPost]
        [Route("search")]
        public IActionResult Search([FromBody] SearchParameter searchParameter)
        {
            var nhanVienPage = _nhanVienService.Search(searchParameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(nhanVienPage.GetPagination()));
            return Ok(nhanVienPage);
        }

        public IActionResult Index(int? page, int? size)
        {
            var searchParam = new SearchParameter()
            {
                PageNumber = page ?? 1,
                PageSize = size ?? 20
            };
            var nhanVienPage = _nhanVienService.SearchNhanVien(searchParam);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(nhanVienPage.GetPagination()));
            return Ok(nhanVienPage);
        }
        [HttpPost]
        [Authorization("RoleBasedPolicy", "ADMIN")]
        public IActionResult Create([FromBody] NhanVienDTO nhanVienDTO)
        {
            var nhanVienId = _nhanVienService.Add(nhanVienDTO);
            return Ok(new
            {
                NhanVienId = nhanVienId
            });
        }
        [HttpPut]
        [Route("{nhanVienId}")]
        [Authorization("RoleBasedPolicy", "ADMIN")]
        public IActionResult Update([FromRoute]int nhanVienId, [FromBody] NhanVienDTO nhanVienDTO)
        {
            _nhanVienService.Update(nhanVienId, nhanVienDTO);
            return Ok();
        }
        [HttpPost]
        [Route("import")]
        [Authorization("RoleBasedPolicy", "ADMIN")]
        public IActionResult Import([FromForm] IFormFile file)
        {
            _logger.Info($"Importing NhanVien data from file: {file.FileName}");
            var res = _nhanVienService.Import(file);
            _logger.Info($"Imported NhanVien data from file: {file.FileName}");
            return Ok(res);
        }
    }
}
