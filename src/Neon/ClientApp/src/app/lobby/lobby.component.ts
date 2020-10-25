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
  public question$: Observable<Question>;
  public users$: Observable<Array<UserInfo>>;

  constructor(private signalrService: SignalrService) {

  }

  ngOnInit() {
    this.question$ = this.signalrService.question$;
    this.users$ = this.signalrService.users$;

    this.question$.subscribe(value => console.log(value));
  }
}

