import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedPrivateComponent } from './published-private.component';

describe('PublishedPrivateComponent', () => {
  let component: PublishedPrivateComponent;
  let fixture: ComponentFixture<PublishedPrivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublishedPrivateComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedPrivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
