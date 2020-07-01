import * as signalR from "@microsoft/signalr";
import { Observable, BehaviorSubject } from 'rxjs';
import { UserInfo } from "./user-info";

export class SignalrService {
  private hubConnection: signalR.HubConnection;
  private users: BehaviorSubject<Array<UserInfo>>;
  public users$: Observable<Array<UserInfo>>;

  constructor() { }

  public async startConnection(): Promise<void> {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('/lobbyHub')
      .build();

    this.users = new BehaviorSubject([]);
    this.users$ = this.users.asObservable();

    this.hubConnection.on("userConnected", (id: string, username: string) => {
      const user = {
        id: id,
        name: username,
        imageUrl: `https://graph.facebook.com/${id}/picture?type=large`,
        profileUrl: `https://facebook.com/${id}`
      };

      this.users.next([...this.users.getValue(), user]);
    });

    this.hubConnection.on("userDisconnected", (id: string) => {
      console.log(id);
    });

    this.hubConnection.start().then(() => {
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

  private newFbUserOnline() {
    window['FB'].api('/me',
      { fields: 'id, last_name, first_name, email' },
      userInfo => {
        this.hubConnection.send("NewOnlineUser", userInfo.id, `${userInfo.first_name} ${userInfo.last_name}`);
      }
    );
  }
}
