using Microsoft.AspNetCore.Mvc;
using ChanDoanXray.Attributes;
using ChanDoanXray.DTOs;
using ChanDoanXray.Pagination;
using ChanDoanXray.Services;
using System.Text.Json;
using ChanDoanXray.Models;

namespace ChanDoanXray.Controllers
{
    [Route("api/benh-nhan")]
    [ApiController]
    //[Authorization("RoleBasedPolicy", "USER,ADMIN")]
    public class BenhNhanControllerAPI : ControllerBase
    {
        private readonly IBenhNhanService _benhNhanService;

        public BenhNhanControllerAPI(IBenhNhanService benhNhanService)
        {
            _benhNhanService = benhNhanService;
        }

        [HttpPost]
        [Route("search")]
       // [Authorization("RoleBasedPolicy", "USER,ADMIN")]
        public ActionResult Search([FromBody] SearchParameter searchParameter)
        {
            var benhNhanPage = _benhNhanService.Search(searchParameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(benhNhanPage.GetPagination()));
            Console.WriteLine(benhNhanPage);
            return Ok(benhNhanPage);
        }

        [HttpGet]
        [Route("{benhNhan_Id}")]
        [Authorization("RoleBasedPolicy", "USER,ADMIN")]
        public ActionResult Get([FromRoute] int benhNhan_Id)
        {
            var benhNhan = _benhNhanService.Get(benhNhan_Id);
            return Ok(benhNhan);
        }

        [HttpPost]
        //[Authorization("RoleBasedPolicy", "ADMIN")]
        public ActionResult Create([FromBody] BenhNhanViewDTO benhNhan)
        {
            var createdBenhNhan = _benhNhanService.Add(benhNhan);
            return Ok(createdBenhNhan);
        }

        [HttpPut]
        [Route("{benhnhanid}")]
        [Authorization("RoleBasedPolicy", "ADMIN")]
        public ActionResult Update([FromRoute] int benhnhanid, [FromBody] BenhNhanViewDTO benhnhan)
        {
            var updatedbenhnhan = _benhNhanService.Update(benhnhanid, benhnhan);
            return Ok(updatedbenhnhan);
        }
        //[HttpGet]
        //[Route("{benhnhanid}")]
        //[Authorization("RoleBasedPolicy", "USER,ADMIN")]
        //public ActionResult Get([FromRoute] int benhnhanid)
        //{
        //    var benhnhan = _benhNhanService.Get(benhnhanid);
        //    return Ok(benhnhan);
        //}

        //[HttpPost]
        //[Route("search")]
        //[Authorization("RoleBasedPolicy", "USER,ADMIN")]
        //public ActionResult Search([FromBody] SearchParameter searchParameter)
        //{
        //    var benhnhanpage = _benhNhanService.Search(searchParameter);
        //    Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(benhnhanpage.GetPagination()));
        //    return Ok(benhnhanpage);
        //}
    }
}
