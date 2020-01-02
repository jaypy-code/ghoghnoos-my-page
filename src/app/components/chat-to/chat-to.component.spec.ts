import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatToComponent } from './chat-to.component';

describe('ChatToComponent', () => {
  let component: ChatToComponent;
  let fixture: ComponentFixture<ChatToComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatToComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
