import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Topic } from '../topic';
import { SignalrService } from '../signalr.service'

@Component({
    selector: 'app-topic-list',
    templateUrl: './topic-list.component.html'
})
export class TopicListComponent implements OnInit  {
  public topics$: Observable<Array<Topic>>;

  constructor(private signalrService: SignalrService) {
    
  }

  async ngOnInit(): Promise<void> {
    await this.signalrService.startConnection();
    this.topics$ = this.signalrService.topics$
  }
}
