import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailsNavComponent } from './book-details-nav.component';

describe('BookDetailsNavComponent', () => {
  let component: BookDetailsNavComponent;
  let fixture: ComponentFixture<BookDetailsNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookDetailsNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDetailsNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
