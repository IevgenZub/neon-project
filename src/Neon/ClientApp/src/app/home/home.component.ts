import { Component, OnInit } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit  {
  divMessages: HTMLDivElement;
  tbMessage: HTMLInputElement;
  btnSend: HTMLButtonElement;
  connection: signalR.HubConnection;

  constructor(private httpClient: HttpClient) {
    
  }

  ngOnInit(): void {
    this.divMessages = document.querySelector("#divMessages");
    this.tbMessage = document.querySelector("#tbMessage");
    this.btnSend = document.querySelector("#btnSend");
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("/homeHub")
      .build();

    this.connection.on("messageReceived", (username: string, message: string) => {
      console.log(username, message);
    });

    this.connection.start().catch(err => document.write(err));
  }

  send() {
    window['FB'].getLoginStatus(response => {
      if (response.status === 'connected') {
        // The user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token 
        this.sendWithFbUser();
      } else {
        window['FB'].login((response) => {
          console.log('login response', response);
          if (response.authResponse) {
            this.sendWithFbUser();
          } else {
            console.log('User login failed');
          }
        }, { scope: 'email' });
      }
    });
  }

  sendWithFbUser() {
    window['FB'].api('/me', {
      fields: 'last_name, first_name, email'
    }, (userInfo) => {
      this.connection.send("newMessage", userInfo.email, this.tbMessage.value)
        .then(() => this.tbMessage.value = "");
    });
  }
}
