import * as signalR from "@microsoft/signalr";
import { Observable, BehaviorSubject } from 'rxjs';
import { UserInfo } from "./user-info";

export class SignalrService {
  private hubConnection: signalR.HubConnection;
  private users: BehaviorSubject<Array<UserInfo>>;
  public users$: Observable<Array<UserInfo>>;

  public async startConnection(): Promise<void> {
    this.users = new BehaviorSubject([]);
    this.users$ = this.users.asObservable();

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('/lobbyHub')
      .build();

    this.hubConnection.start().then(() => {
      window['FB'].getLoginStatus(response => {
        if (response.status === 'connected') {
          this.newFbUserOnline();
        } else {
          window['FB'].login((response) => {
            if (response.authResponse) {
              this.newFbUserOnline();
            } else {
              console.log('User login failed');
            }
          }, { scope: 'email' });
        }
      });

      this.hubConnection.stream("StreamQuestions").subscribe({
        next: function (question) {
          console.log("Next: " + question.text);
        },
        error: function (error) {
          console.log("My error: " + error);
        },
        complete: function () {
          console.log("Completed")
        }
      });

    }).catch(err => document.write(err));

    // Server event handlers

    this.hubConnection.on("userConnected", (id: string, username: string) => {
      if (this.users.getValue().filter(u => u.id === id).length === 0) {
        const user = {
          id: id,
          name: username,
          imageUrl: `https://graph.facebook.com/${id}/picture?type=normal`,
          profileUrl: `https://facebook.com/${id}`
        };

        this.users.next([...this.users.getValue(), user]);
      }
    });

    this.hubConnection.on("userDisconnected", (id: string) => {
      console.log(id);
    });
  }

  private newFbUserOnline() {
    window['FB'].api('/me',
      { fields: 'id, last_name, first_name, email' },
      userInfo => {
        this.hubConnection.send("NewOnlineUser", userInfo.id, `${userInfo.first_name} ${userInfo.last_name}`);
      }
    );
  }
}
