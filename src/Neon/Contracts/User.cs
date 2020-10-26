using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Neon.Contracts
{
    public class User
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string ProfileUrl { get; set; }
        public string ConnectionId { get; set; }
    }
}
