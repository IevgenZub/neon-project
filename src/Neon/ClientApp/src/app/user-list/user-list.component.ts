import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfo } from '../user-info';
import { SignalrService } from '../signalr.service'

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit  {
  public users$: Observable<Array<UserInfo>>;

  constructor(private signalrService: SignalrService) {
    
  }

  ngOnInit() {
    this.users$ = this.signalrService.users$
  }
}
