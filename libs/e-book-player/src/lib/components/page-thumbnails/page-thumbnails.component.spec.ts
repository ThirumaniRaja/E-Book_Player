import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageThumbnailsComponent } from './page-thumbnails.component';

describe('PageThumbnailsComponent', () => {
  let component: PageThumbnailsComponent;
  let fixture: ComponentFixture<PageThumbnailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageThumbnailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageThumbnailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
