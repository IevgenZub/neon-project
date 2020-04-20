import { Component, OnInit } from '@angular/core';
import * as signalR from "@microsoft/signalr";

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html'
})
export class LobbyComponent implements OnInit {
  divMessages: HTMLDivElement;
  tbMessage: HTMLInputElement;
  btnSend: HTMLButtonElement;
  connection: signalR.HubConnection;

  ngOnInit(): void {
    this.divMessages = document.querySelector("#divMessages");
    this.tbMessage = document.querySelector("#tbMessage");
    this.btnSend = document.querySelector("#btnSend");
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("/lobbyHub")
      .build();

    this.connection.on("userConnected", (username: string, id: string) => {
      console.log(username, id);
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
