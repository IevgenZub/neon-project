import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SignalrService } from '../signalr.service';
import { User, Question } from '../contracts';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html'
})
export class LobbyComponent implements OnInit {
  public question$: Observable<Question>;
  public users$: Observable<Array<User>>;
  public isScoreLoaded = true;
  public questionSeconds: number;
  public questionInterval: NodeJS.Timeout;

  constructor(private signalrService: SignalrService) {}

  async ngOnInit() {
    await this.signalrService.startConnection();
    this.question$ = this.signalrService.question$;
    this.users$ = this.signalrService.users$;

    this.question$.subscribe(_ => {
      clearTimeout(this.questionInterval);
      this.questionSeconds = 5;
      this.questionInterval = setInterval(() => {
        if (this.questionSeconds !== 0) {
          this.questionSeconds -= 1;
        }
      }, 1000);
    });
  }

  async onSubmit(questionId: string, answer: string) {
    this.isScoreLoaded = false;
    await this.signalrService.newAnswer(questionId, answer);
    setTimeout(_ => { this.isScoreLoaded = true; }, 300);
  }
}

