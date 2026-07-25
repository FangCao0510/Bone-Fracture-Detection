namespace ChanDoanXray.Exceptions
{
    /*
     Exception from user's input. It implies that user's input is not valid.
     */
    public class IllegalArgumentException : Exception
    {
        public IllegalArgumentException(string? message) : base(message)
        {
        }
    }
    public class AccessDeniedException : Exception
    {
        public AccessDeniedException(string? message) : base(message)
        {
        }
    }
}
