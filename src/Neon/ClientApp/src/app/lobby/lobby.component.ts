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

  constructor(private signalrService: SignalrService) {}

  async ngOnInit() {
    await this.signalrService.startConnection();
    this.question$ = this.signalrService.question$;
    this.users$ = this.signalrService.users$;
  }

  async onSubmit(questionId: string, answer: string) {
    this.isScoreLoaded = false;
    await this.signalrService.newAnswer(questionId, answer);
    setTimeout(_ => { this.isScoreLoaded = true; }, 300);
  }
}

