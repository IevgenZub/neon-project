import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfo } from '../user-info';
import { SignalrService } from '../signalr.service'

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html'
})
export class LobbyComponent implements OnInit  {
  public users$: Observable<Array<UserInfo>>;

  constructor(private signalrService: SignalrService) {
    
  }

  async ngOnInit(): Promise<void> {
    await this.signalrService.startConnection();
    this.users$ = this.signalrService.users$
  }
}
