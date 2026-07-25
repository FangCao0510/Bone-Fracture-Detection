using ChanDoanXray.DTOs;
using ChanDoanXray.Models;
using Riok.Mapperly.Abstractions;

namespace ChanDoanXray.Mappers
{
    public interface IUserMapper
    {
        public CurrentUserDTO From(User user);
    }

    [Mapper]
    public partial class UserMapper : IUserMapper
    {
        [MapProperty(nameof(user.UserRoles), nameof(CurrentUserDTO.Roles), Use = nameof(MapRoles))]
        public partial CurrentUserDTO From(User user);

        private string[] MapRoles(ICollection<UserRole> userRoles)
        {
            return userRoles.Select(ur => ur.Role.Ten).ToArray();
        }
    }
}
