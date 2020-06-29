import { Component, OnInit } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInfo } from '../user-info';

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html'
})
export class LobbyComponent implements OnInit {
  private connection: signalR.HubConnection;
  private users: BehaviorSubject<Array<UserInfo>>;
  public users$: Observable<Array<UserInfo>>;

  ngOnInit(): void {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("/lobbyHub")
      .build();

    this.users = new BehaviorSubject([]);
    this.users$ = this.users.asObservable();

    this.connection.on("userConnected", (username: string, id: string) => {
      const user = {name: username, id: id }
      this.users.next([...this.users.getValue(), user]);
    });

    this.connection.on("userDisconnected", (id: string) => {
      console.log(id);
    });

    this.connection.start().then(() => {
      window['FB'].getLoginStatus(response => {
        if (response.status === 'connected') {
          // The user is logged in and has authenticated your
          // app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed
          // request, and the time the access token 
          this.newFbUserOnline();
        } else {
          window['FB'].login((response) => {
            console.log('login response', response);
            if (response.authResponse) {
              this.newFbUserOnline();
            } else {
              console.log('User login failed');
            }
          }, { scope: 'email' });
        }
      });
    }).catch(err => document.write(err));
  }

  newFbUserOnline() {
    window['FB'].api('/me',
      { fields: 'id, last_name, first_name, email' },
      (userInfo) => {
        this.connection.send("NewOnlineUser", userInfo.email, userInfo.id);
      }
    );
  }
}
