import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BugFormComponent } from './bug-form.component';

describe('BugFormComponent', () => {
  let component: BugFormComponent;
  let fixture: ComponentFixture<BugFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BugFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BugFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
