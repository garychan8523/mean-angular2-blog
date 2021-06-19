import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogSettingComponent } from './blog-setting.component';

describe('BlogSettingComponent', () => {
  let component: BlogSettingComponent;
  let fixture: ComponentFixture<BlogSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
