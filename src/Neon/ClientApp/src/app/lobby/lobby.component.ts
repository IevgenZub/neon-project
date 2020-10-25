import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../question';
import { SignalrService } from '../signalr.service';
import { UserInfo } from '../user-info';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html'
})
export class LobbyComponent implements OnInit {
  public questions$: Observable<Array<Question>>;
  public users$: Observable<Array<UserInfo>>;

  constructor(private signalrService: SignalrService) {

  }

  ngOnInit() {
    this.questions$ = this.signalrService.questions$;
    this.users$ = this.signalrService.users$;

    this.questions$.subscribe(value => console.log(value));
  }
}

