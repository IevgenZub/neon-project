export class User {
  constructor(
    public id: string,
    public name: string,
    public imageUrl: string,
    public connectionId: string,
    public score: number) { }
}

export class Question {
  constructor(
    public id: string,
    public text: string,
    public answers: string[]) { }
}

export class Answer {
  constructor(
    public questionId: string,
    public selectedAnswer: string,
    public userId: string) { }
}

export class Competition {
  constructor(
    public id: string,
    public status: string,
    public startDate: Date,
    public users: User[],
    public questions: Question[]) { }
}
