using Neon.Contracts;
using System;
using System.Collections.Generic;
using System.Reactive.Subjects;
using System.Threading;
using System.Threading.Tasks;

namespace Neon
{
    public class QuestionTicker
    {
        private readonly Timer _timer;
        private readonly TimeSpan _updateInterval;
        private readonly Subject<Question> _subject;
        
        public QuestionTicker()
        {
            _updateInterval = TimeSpan.FromMilliseconds(3000);
            _timer = new Timer(NextQuestion, null, _updateInterval, _updateInterval);
            _subject = new Subject<Question>();
        }

        public IObservable<Question> StreamQuestions()
        {
            return _subject;
        }

        private async void NextQuestion(object state)
        {
            var nextQuestion = await GetNextRandomQuestion();
            _subject.OnNext(nextQuestion);
        }

        private async Task<Question> GetNextRandomQuestion()
        {
            // TODO: Read from database

            var questionA = new Question() 
            {
                Text = "Ты бузишь ? ", 
                Answers = new List<string>() { "Да", "Нет", "Я подумаю", "Точно нет"}
            };

            var questionB = new Question()
            {
                Text = "Как дела ? ",
                Answers = new List<string>() { "Нормально", "Не бузи", "Хочу кушать", "Ничё так" }
            };

            var questionС = new Question()
            {
                Text = "Шо делать ? ",
                Answers = new List<string>() { "Не знаю", "Не бузи", "Хочу кушать", "Фильм" }
            };

            var questions = new List<Question>() { questionA, questionB, questionС };
            var randomNumber = new Random().Next(0, 2);
            var result = questions[randomNumber];

            return await Task.FromResult(result);
        }
    }
}
