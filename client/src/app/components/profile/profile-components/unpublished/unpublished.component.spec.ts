import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpublishedComponent } from './unpublished.component';

describe('UnpublishedComponent', () => {
  let component: UnpublishedComponent;
  let fixture: ComponentFixture<UnpublishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnpublishedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
