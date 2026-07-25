namespace ChanDoanXray.Pagination
{
    public class SearchParameter
    {
        const int maxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int _pageSize = 10;
        public int PageSize
        {
            get
            {
                return _pageSize;
            }
            set
            {
                _pageSize = (value > maxPageSize) ? maxPageSize : value;
            }
        }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? TenBenhNhan { get; set; }
    }
}
