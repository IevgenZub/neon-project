using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Neon.Contracts
{
    public class Competition
    {
        public string Id { get; set; }
        public string Status { get; set; }
        public DateTime StartDate { get; set; }
        public List<User> Users { get; set; }
        public List<Question> Questions { get; set; }
    }
}
