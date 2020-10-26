import { Component, OnInit } from '@angular/core';
import { SignalrService } from './signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private signalrService: SignalrService) {

  }

  async ngOnInit(): Promise<void> {
    await this.fbLibrary();
  }

 async fbLibrary() {
    (window as any).fbAsyncInit = async () => {
      await window['FB'].init({
        appId: '  ',
        cookie: true,
        xfbml: true,
        version: 'v3.1'
      });

      window['FB'].AppEvents.logPageView();
    };
  }
}
