import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizActiveComponent } from './quiz-active.component';

describe('QuizActiveComponent', () => {
  let component: QuizActiveComponent;
  let fixture: ComponentFixture<QuizActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
