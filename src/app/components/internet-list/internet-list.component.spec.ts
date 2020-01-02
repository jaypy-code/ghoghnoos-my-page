import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetListComponent } from './internet-list.component';

describe('InternetListComponent', () => {
  let component: InternetListComponent;
  let fixture: ComponentFixture<InternetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
