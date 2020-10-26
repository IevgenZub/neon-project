import * as signalR from "@microsoft/signalr";
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { User, Question, Answer } from "./contracts";

export class SignalrService {
  private userId: string;
  private hubConnection: signalR.HubConnection;
  private users: BehaviorSubject<Array<User>>;
  public users$: Observable<Array<User>>;
  private question: Subject<Question>;
  public question$: Observable<Question>;

  public async startConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("/lobbyHub")
      .build();

    await this.hubConnection.start();

    this.question = new Subject();
    this.question$ = this.question.asObservable();
    this.hubConnection.stream("StreamQuestions").subscribe({
      next: question => this.question.next(question),
      error: _ => (_),
      complete: () => console.log("Completed")
    });

    const users = await this.hubConnection.invoke("GetUsersOnline");
    this.users = new BehaviorSubject(users);
    this.users$ = this.users.asObservable();

    this.hubConnection.on("userConnected", (user: User) => {
      if (this.users.getValue().filter(u => u.id === user.id).length === 0) {
        this.users.next([...this.users.getValue(), user]);
      }
    });

    this.hubConnection.on("userDisconnected", (user: User) => {
      if (this.users.getValue().filter(u => u.id === user.id).length !== 0) {
        this.users.next(this.users.getValue().filter(u => u.id !== user.id));
      }
    });

    this.hubConnection.on("userScored", (user: User) => {
      if (this.users.getValue().filter(u => u.id === user.id).length !== 0) {
        this.users.next([...this.users.getValue().filter(u => u.id !== user.id), user]);
      }
    });

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
  }

  public async newAnswer(questionId: string, answer: string) {
    this.hubConnection.send("NewOnlineUser",
      new Answer(
        questionId,
        answer,
        this.userId));
  }

  private newFbUserOnline() {
     window["FB"].api("/me",
       { fields: "id, last_name, first_name, email, picture" },
       userInfo => {
         this.userId = userInfo.id;
         this.hubConnection.send("NewOnlineUser",
           new User(
             userInfo.id,
             userInfo.first_name,
             userInfo.picture.data.url,
             this.hubConnection.connectionId,
             0))
       });
  }  
}
