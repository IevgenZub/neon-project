import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SignalrService } from '../signalr.service';
import { User } from '../user-info';
import { Question } from '../question';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html'
})
export class LobbyComponent implements OnInit {
  public question$: Observable<Question>;
  public users$: Observable<Array<User>>;

  constructor(private signalrService: SignalrService) {}

  ngOnInit() {
    this.question$ = this.signalrService.question$;
    this.users$ = this.signalrService.users$;
  }
}

