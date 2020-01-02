import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetFormComponent } from './internet-form.component';

describe('InternetFormComponent', () => {
  let component: InternetFormComponent;
  let fixture: ComponentFixture<InternetFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternetFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
