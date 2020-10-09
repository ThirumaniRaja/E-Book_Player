import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilityBarComponent } from './utility-bar.component';

describe('UtilityBarComponent', () => {
  let component: UtilityBarComponent;
  let fixture: ComponentFixture<UtilityBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilityBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilityBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
