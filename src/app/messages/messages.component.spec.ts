import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesComponent } from './messages.component';
import { MessageService } from '../services/message.service';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;

  beforeEach(async(() => {

    let messageService = jasmine.createSpyObj("MessageService", ["loadNotifications", "clear"]);

    TestBed.configureTestingModule({
      declarations: [ MessagesComponent ]
      , providers: [ { provide: MessageService, useValue: messageService } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
