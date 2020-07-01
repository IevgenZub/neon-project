import * as signalR from "@microsoft/signalr";
import { Observable, BehaviorSubject } from 'rxjs';
import { UserInfo } from "./user-info";
import { Topic } from "./topic";

export class SignalrService {
  private hubConnection: signalR.HubConnection;
  private users: BehaviorSubject<Array<UserInfo>>;
  public users$: Observable<Array<UserInfo>>;
  private topics: BehaviorSubject<Array<Topic>>;
  public topics$: Observable<Array<Topic>>;

  constructor() { }

  public async startConnection(): Promise<void> {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('/lobbyHub')
      .build();

    this.users = new BehaviorSubject([]);
    this.users$ = this.users.asObservable();

    this.topics = new BehaviorSubject([
      { id: '1', name: 'Music', description: 'Upcoming music events, releases' },
      { id: '2', name: 'Sports', description: 'Sport events, players' },
      { id: '3', name: 'Books', description: 'Books review' }]);

    this.topics$ = this.topics.asObservable();

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
