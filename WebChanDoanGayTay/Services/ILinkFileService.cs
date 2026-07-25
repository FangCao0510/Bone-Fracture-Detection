using log4net;
using Microsoft.EntityFrameworkCore;
using ChanDoanXray.Constants;
using ChanDoanXray.DTOs;
using ChanDoanXray.Exceptions;
using ChanDoanXray.Mappers;
using ChanDoanXray.Models;
using ChanDoanXray.Utils;
using System.Linq;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Text;
using System.Net.Http;
using Microsoft.Extensions.DependencyInjection;
using System.IO;

namespace ChanDoanXray.Services
{
    public interface ILinkFileService
    {
        public LinkFileDTO[] Upload(int TiepNhanId, LinkFileUploadDTO[] linkFileDTO);
        public LinkFileDTO[] FindAll(int TiepNhanId);
        public byte[] Download(int TiepNhanId);
        public LinkFileDTO Get(int TiepNhanId);

        public Task<ChanDoanResultDTO> PreviewChanDoan(int tiepNhanId);
        public Task<LinkFileDTO> chanDoan(int tiepNhanId);
        public Task<LinkFileDTO> SaveChanDoan(int tiepNhanId, ChanDoanResultDTO result);
    }
    public class LinkFileService : ILinkFileService
    {
        private readonly XrayContext _context;
        private readonly ILinkFileMapper _linkFileMapper;
        private readonly IFileUtils _fileUtils;
        private readonly HttpClient _httpClient;
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public LinkFileService(XrayContext context,
            ILinkFileMapper linkFileMapper,
            IFileUtils fileUtils, HttpClient httpClient, IServiceScopeFactory serviceScopeFactory)
        {
            _context = context;
            _linkFileMapper = linkFileMapper;
            _fileUtils = fileUtils;
            _httpClient = httpClient;
            _serviceScopeFactory = serviceScopeFactory;
        }

        public byte[] Download(int TiepNhanid)
        {
            var ctdt = _context.TiepNhans.Find(TiepNhanid);
            if (ctdt == null)
            {
                throw new IllegalArgumentException("Tiếp nhận không tồn tại.");
            }
            var taiLieu = _context.LinkFiles
                .FirstOrDefault(l => l.TiepNhanId == TiepNhanid);
            if (taiLieu == null)
            {
                throw new IllegalArgumentException("Tài liệu không tồn tại.");
            }
            return _fileUtils.Download(taiLieu.DuongDanChanDoan);
        }

        public LinkFileDTO[] FindAll(int ctdtId)
        {
            var deTai = _context.TiepNhans
                .Include(d => d.LinkFiles)
                .Where(d => d.Id == ctdtId)
                .SingleOrDefault();
            if (deTai == null)
            {
                throw new IllegalArgumentException("Tiếp nhận không tồn tại.");
            }
            return deTai.LinkFiles.Select(t => _linkFileMapper.From(t)).ToArray();
        }

        public LinkFileDTO Get(int ctdtId)
        {
            var deTai = _context.TiepNhans.Find(ctdtId);
            if (deTai == null)
            {
                throw new IllegalArgumentException("Tiếp nhận không tồn tại.");
            }
            var taiLieu = _context.LinkFiles
                .FirstOrDefault(l=>l.TiepNhanId==ctdtId);
            if (taiLieu == null)
            {
                throw new IllegalArgumentException("Tài liệu không tồn tại.");
            }
            return _linkFileMapper.From(taiLieu);
        }

        public LinkFileDTO[] Upload(int ctdtId, LinkFileUploadDTO[] taiLieuUploadDTOs)
        {
            var ctdt = _context.TiepNhans.Find(ctdtId);
            if (ctdt == null)
            {
                throw new IllegalArgumentException("Tiếp nhận không tồn tại.");
            }
            var result = new List<LinkFile>();
            foreach (var taiLieuDTO in taiLieuUploadDTOs)
            {
                var formFile = taiLieuDTO.File;
                if (formFile.Length > 0)
                {
                    var fileName = _fileUtils.Upload(formFile);
                    result.Add(new LinkFile
                    {
                        TiepNhan = ctdt,
                        DuongDanGoc = fileName,
                        FilenameGoc = formFile.FileName,
                        Loai = taiLieuDTO.Loai
                    });

                }
            }
            _context.Update(ctdt);
            _context.LinkFiles.AddRange(result);
            _context.SaveChanges();
            return result.Select(taiLieu => _linkFileMapper.From(taiLieu))
                .ToArray();
        }
        public async Task UpdateTrangThaiTiepNhan(int tiepNhanId)
        {
            var tiepNhan = await _context.TiepNhans
                .FirstOrDefaultAsync(t => t.Id == tiepNhanId);

            if (tiepNhan != null)
            {
                tiepNhan.TrangThai = true;
                _context.TiepNhans.Update(tiepNhan);
                await _context.SaveChangesAsync();
            }
        }

        private async Task<ChanDoanResultDTO> AnalyzeImageAsync(int tiepNhanId)
        {
            // First, get all the data we need from the database
            string imagePath;

            // Capture all necessary data in this scope to minimize DB context interaction time
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<XrayContext>();

                var linkFile = await dbContext.LinkFiles
                    .Include(f => f.TiepNhan)
                    .FirstOrDefaultAsync(f => f.TiepNhanId == tiepNhanId && f.Loai == "Xray");

                if (linkFile == null)
                    throw new Exception("Không tìm thấy ảnh X-ray cho tiếp nhận này.");

                // Make a deep copy of the data we need to avoid lazy loading issues
                //imagePath = Path.Combine("D:\\Documents\\Code\\WebChanDoanGayTay\\WebChanDoanGayTay\\Uploads", linkFile.DuongDanGoc);
                imagePath = _fileUtils.GetAbsolutePath(linkFile.DuongDanGoc);
            }

            // Make the HTTP request completely outside of any DB context
            ChanDoanResultDTO aiResult;
            try
            {
                var payload = new
                {
                    id = tiepNhanId.ToString(),
                    image_path = imagePath
                };

                using (var client = new HttpClient())
                {
                    var response = await client.PostAsJsonAsync("http://127.0.0.1:8000/predict/", payload);
                    if (!response.IsSuccessStatusCode)
                        throw new Exception($"Lỗi từ server AI: {response.StatusCode}");

                    aiResult = await response.Content.ReadFromJsonAsync<ChanDoanResultDTO>();
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Lỗi khi gọi API AI: {ex.Message}");
                throw new Exception("Có lỗi xảy ra khi gọi dịch vụ AI. Vui lòng thử lại.");
            }
            return aiResult;
        }

        public async Task<ChanDoanResultDTO> PreviewChanDoan(int tiepNhanId)
        {
            return await AnalyzeImageAsync(tiepNhanId);
        }

        public async Task<LinkFileDTO> chanDoan(int tiepNhanId)
        {
            var aiResult = await AnalyzeImageAsync(tiepNhanId);
            // Now update the database with the results in a separate scope
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<XrayContext>();

                // Re-fetch the LinkFile in this new scope
                var linkFileToUpdate = await dbContext.LinkFiles
                    .Include(f => f.TiepNhan)
                    .FirstOrDefaultAsync(f => f.TiepNhanId == tiepNhanId && f.Loai == "Xray");

                if (linkFileToUpdate == null)
                    throw new Exception("Không tìm thấy ảnh X-ray cho tiếp nhận này.");

                // Update with the AI results
                linkFileToUpdate.chanDoan = aiResult.PredictionText;  // Lưu kết quả chẩn đoán
                linkFileToUpdate.DuongDanChanDoan = aiResult.DiagnosticImagePath;  // Lưu đường dẫn ảnh chẩn đoán

                if (linkFileToUpdate.TiepNhan != null)
                {
                    linkFileToUpdate.TiepNhan.TrangThai = true;  // Cập nhật trạng thái của tiếp nhận
                    await dbContext.SaveChangesAsync();  // Lưu các thay đổi vào cơ sở dữ liệu
                    Console.WriteLine($"Đã cập nhật chẩn đoán cho tiếp nhận ID: {tiepNhanId}");
                    Console.WriteLine($"Kết quả chẩn đoán: {linkFileToUpdate.chanDoan}");
                    Console.WriteLine($"Đường dẫn ảnh chẩn đoán: {linkFileToUpdate.DuongDanChanDoan}");
                }
                else
                {
                    throw new Exception("Không tìm thấy đối tượng TiepNhan liên kết với LinkFile.");
                }

                // Return DTO
                return _linkFileMapper.From(linkFileToUpdate);
            }
        }

        public async Task<LinkFileDTO> SaveChanDoan(int tiepNhanId, ChanDoanResultDTO result)
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<XrayContext>();

                var linkFileToUpdate = await dbContext.LinkFiles
                    .Include(f => f.TiepNhan)
                    .FirstOrDefaultAsync(f => f.TiepNhanId == tiepNhanId && f.Loai == "Xray");

                if (linkFileToUpdate == null)
                    throw new Exception("Không tìm thấy ảnh X-ray cho tiếp nhận này.");

                linkFileToUpdate.chanDoan = result.PredictionText;
                linkFileToUpdate.DuongDanChanDoan = result.DiagnosticImagePath;

                if (linkFileToUpdate.TiepNhan != null)
                {
                    linkFileToUpdate.TiepNhan.TrangThai = true;
                    await dbContext.SaveChangesAsync();
                }
                else
                {
                    throw new Exception("Không tìm thấy đối tượng TiepNhan liên kết với LinkFile.");
                }

                return _linkFileMapper.From(linkFileToUpdate);
            }
        }
    }
}
