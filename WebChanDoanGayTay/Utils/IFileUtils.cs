using Microsoft.EntityFrameworkCore;
using ChanDoanXray.DTOs;
using ChanDoanXray.Exceptions;
using ChanDoanXray.Models;

namespace ChanDoanXray.Utils
{
    public interface IFileUtils
    {
        string Upload(IFormFile formFile);
        byte[] Download(string url);
        string Edit(string url, IFormFile formFile);
        string GetAbsolutePath(string relativePath);
    }
    public class FileUtils : IFileUtils
    {
        private readonly IConfiguration _configuration;
        private readonly string _rootUploadDir;
        public FileUtils(IConfiguration configuration)
        {
            _configuration = configuration;
            _rootUploadDir = Path.GetFullPath(_configuration.GetValue<string>("Application:UploadDir"));
            if (_rootUploadDir == null)
            {
                throw new Exception("Chưa cấu hình thư mục lưu tài liệu.");
            }
        }
        public byte[] Download(string url)
        {
            var filePath = Path.Combine(_rootUploadDir, url);
            return File.ReadAllBytes(filePath);
        }
        public string GetAbsolutePath(string relativePath)
        {
            return Path.Combine(_rootUploadDir, relativePath);
        }
        public string Edit(string url, IFormFile formFile)
        {
            var extension = Path.GetExtension(formFile.FileName);
            var isFileNameInvalid = Path.GetInvalidFileNameChars().Any(c => formFile.FileName.Contains(c));
            if (isFileNameInvalid)
            {
                throw new IllegalArgumentException("Tên tài liệu không hợp lệ.");
            }
            var randomFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(_rootUploadDir, url);
            var newFilePath = Path.Combine(_rootUploadDir, randomFileName);
            using (var stream = File.Open(filePath, FileMode.Truncate))
            {
                formFile.CopyTo(stream);
            }
            File.Move(filePath, newFilePath);
            return newFilePath;
        }

        public string Upload(IFormFile formFile)
        {
            var extension = Path.GetExtension(formFile.FileName);
            var isFileNameInvalid = Path.GetInvalidFileNameChars().Any(c => formFile.FileName.Contains(c));
            if (isFileNameInvalid)
            {
                throw new IllegalArgumentException("Tên tài liệu không hợp lệ.");
            }
            var randomFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(_rootUploadDir, randomFileName);
            using (var stream = File.Create(filePath))
            {
                formFile.CopyTo(stream);
                return randomFileName;
            }
        }
    }
}
