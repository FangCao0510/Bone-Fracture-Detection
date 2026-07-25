using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ChanDoanXray.Attributes;
using ChanDoanXray.Constants;
using ChanDoanXray.DTOs;
using ChanDoanXray.Pagination;
using ChanDoanXray.Services;
using System.Text.Json;
using ChanDoanXray.Models;
using ChanDoanXray.Services;
using Microsoft.EntityFrameworkCore;

namespace ChanDoanXray.Controllers
{
    [Route("api/TiepNhan")]
    [ApiController]
    
    public class TiepNhanControllerAPI : ControllerBase
    {
        private readonly ITiepNhanService _tnService;
        private readonly ILinkFileService _linkFileService;

        public TiepNhanControllerAPI(ITiepNhanService tiepNhanService, ILinkFileService linkFileService)
        {
            _tnService = tiepNhanService;
            _linkFileService = linkFileService;
        }
        [HttpPost]
        [Route("search")]
        //[Authorization("RoleBasedPolicy", "USER,ADMIN")]
        public IActionResult Search([FromBody] SearchParameter searchParameter)
        {
            var deTaiPage = _tnService.Search(searchParameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(deTaiPage.GetPagination()));
            return Ok(deTaiPage);
        }
        [HttpGet]
        //[Route("{TiepNhanid}")]
        //[Authorization("RoleBasedPolicy", "USER,ADMIN")]
        public IActionResult Get()
        {
            var tiepNhan = _tnService.Get();
            return Ok(tiepNhan);
        }
        [HttpGet]
        [Route("{TiepNhanid}")]
        //[Authorization("RoleBasedPolicy", "USER,ADMIN")]
        public IActionResult Get([FromRoute] int tiepNhanId)
        {
            var tiepNhan = _tnService.Get(tiepNhanId);
            return Ok(tiepNhan);
        }
        [HttpPost]
        //[Authorization("RoleBasedPolicy", "USER,ADMIN")]
        public IActionResult Create([FromBody] TiepNhanDTO tiepNhan)
        {
            ;
            return Ok(_tnService.Add(tiepNhan));
        }
        [HttpPost]
        [Route("{tiepNhanId}")]
        //[Authorization("RoleBasedPolicy", "USER,ADMIN")]
        public IActionResult UploadTaiLieu([FromForm] LinkFileUploadDTO[] linkFiles,
            [FromRoute]int tiepNhanId)
        {
            var result = _linkFileService.Upload(tiepNhanId, linkFiles);
            return Ok(result);
        }
        [HttpGet]
        [Route("{TiepNhanid}/linkfile")]
        [Authorization("RoleBasedPolicy", "USER,ADMIN")]
        public IActionResult FindAll([FromRoute] int TiepNhanid)
        {

            var result = _linkFileService.FindAll(TiepNhanid);

            return Ok(result);
        }
        [HttpGet]
        [Route("{tiepnhanid}/anh")]
        [AllowAnonymous]
        public IActionResult Download([FromRoute] int tiepnhanid)
        {
            var result = _linkFileService.Download(tiepnhanid);
            var Linkfile = _linkFileService.Get(tiepnhanid);
            return File(result, "application/*", Linkfile.DuongDanChanDoan); ;
        }
        [HttpPost]
        [Route("chanDoan/{tiepNhanId}")]
        //[Authorization("RoleBasedPolicy", "USER,ADMIN")]
        public async Task<IActionResult> chanDoan([FromRoute] int tiepNhanId)
        {
            var result =await _linkFileService.chanDoan(tiepNhanId);
            return Ok(result);
        }
        [HttpPost]
        [Route("chanDoanPreview/{tiepNhanId}")]
        //[Authorization("RoleBasedPolicy", "USER,ADMIN")]
        public async Task<IActionResult> ChanDoanPreview([FromRoute] int tiepNhanId)
        {
            var result = await _linkFileService.PreviewChanDoan(tiepNhanId);
            return Ok(result);
        }
        [HttpPost]
        [Route("saveChanDoan/{tiepNhanId}")]
        //[Authorization("RoleBasedPolicy", "USER,ADMIN")]
        public async Task<IActionResult> SaveChanDoan([FromRoute] int tiepNhanId, [FromBody] ChanDoanResultDTO request)
        {
            var result = await _linkFileService.SaveChanDoan(tiepNhanId, request);
            return Ok(result);
        }
    }
}
