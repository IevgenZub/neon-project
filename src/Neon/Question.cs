﻿using System.Collections.Generic;

namespace Neon
{
    public class Question
    {
        public string Text { get; set; }
        public List<string> Answers { get; set; }
        public string CorrectAnswer { get; set; }
    }
}