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
    await this.signalrService.startConnection();
  }

 async fbLibrary() {
    (window as any).fbAsyncInit = function () {
      window['FB'].init({
        appId: '586725345276662',
        cookie: true,
        xfbml: true,
        version: 'v3.1'
      });

      window['FB'].AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }
}
