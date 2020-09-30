import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerResourceComponent } from './player-resource.component';

describe('PlayerResourceComponent', () => {
  let component: PlayerResourceComponent;
  let fixture: ComponentFixture<PlayerResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
