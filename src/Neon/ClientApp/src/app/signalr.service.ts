import * as signalR from "@microsoft/signalr";
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { UserInfo } from "./user-info";
import { Question } from "./question";

export class SignalrService {
  private hubConnection: signalR.HubConnection;
  private users: BehaviorSubject<Array<UserInfo>>;
  public users$: Observable<Array<UserInfo>>;
  private question: Subject<Question>;
  public question$: Observable<Question>;

  public async startConnection(): Promise<void> {
    this.users = new BehaviorSubject([]);
    this.users$ = this.users.asObservable();
    this.question = new Subject();
    this.question$ = this.question.asObservable();

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

      this.hubConnection.stream("StreamQuestions").subscribe(
      {
        next: question => this.question.next(question),
        error: _ => (_),
        complete: () => console.log("Completed")
      });

    }).catch(err => document.write(err));

    this.hubConnection.on("userConnected", (id: string, username: string, userImageUrl: string) => {
      if (this.users.getValue().filter(u => u.id === id).length === 0) {
        const user = {
          id: id,
          name: username,
          profileUrl: `https://facebook.com/${id}`,
          imageUrl: userImageUrl
        };

        this.users.next([...this.users.getValue(), user]);
      }
    });
  }

  private newFbUserOnline() {
    window['FB'].api('/me',
      {fields: 'id, last_name, first_name, email, picture'},
      userInfo => this.hubConnection.send("NewOnlineUser",
        userInfo.id, userInfo.first_name, userInfo.picture.data.url)
    );
  }
}
