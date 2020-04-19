import { Component, OnInit } from '@angular/core';
import * as signalR from "@microsoft/signalr";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit  {
  divMessages: HTMLDivElement;
  tbMessage: HTMLInputElement;
  btnSend: HTMLButtonElement;
  connection: signalR.HubConnection;
  username: string;

  ngOnInit(): void {
    this.divMessages = document.querySelector("#divMessages");
    this.tbMessage = document.querySelector("#tbMessage");
    this.btnSend = document.querySelector("#btnSend");
    this.username = new Date().getTime().toString();
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("/homeHub")
      .build();

    this.connection.on("messageReceived", (username: string, message: string) => {
      console.log(username, message);
    });

    this.connection.start().catch(err => document.write(err));
  }

  send() {
    this.connection.send("newMessage", this.username, this.tbMessage.value)
      .then(() => this.tbMessage.value = "");
  }
}
