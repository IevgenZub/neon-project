import * as signalR from "@microsoft/signalr";
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { User } from "./user-info";
import { Question } from "./question";

export class SignalrService {
  private hubConnection: signalR.HubConnection;
  private users: BehaviorSubject<Array<User>>;
  public users$: Observable<Array<User>>;
  private question: Subject<Question>;
  public question$: Observable<Question>;

  public async startConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("/lobbyHub")
      .build();

    this.question = new Subject();
    this.question$ = this.question.asObservable();

    await this.hubConnection.start();

    this.hubConnection.stream("StreamQuestions").subscribe({
      next: question => this.question.next(question),
      error: _ => (_),
      complete: () => console.log("Completed")
    });

    const users = await this.hubConnection.invoke("GetUsersOnline");
    this.users = new BehaviorSubject(users);
    this.users$ = this.users.asObservable();

    await window['FB'].getLoginStatus(response => {
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
  
    this.hubConnection.on("userConnected", (user: User) => {
      if (this.users.getValue().filter(u => u.id === user.id).length === 0) {
        this.users.next([...this.users.getValue(), user]);
      }
    });
}

  private newFbUserOnline() {
    window["FB"].api("/me",
      { fields: "id, last_name, first_name, email, picture" },
      userInfo =>
        this.hubConnection.send("NewOnlineUser", new User(userInfo.id, userInfo.first_name, userInfo.picture.data.url, ""))
    );
  }
}
