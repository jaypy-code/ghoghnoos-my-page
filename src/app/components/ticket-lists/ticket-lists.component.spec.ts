import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketListsComponent } from './ticket-lists.component';

describe('TicketListsComponent', () => {
  let component: TicketListsComponent;
  let fixture: ComponentFixture<TicketListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
