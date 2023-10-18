import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeLinksComponent } from './customize-links.component';

describe('CustomizeLinksComponent', () => {
  let component: CustomizeLinksComponent;
  let fixture: ComponentFixture<CustomizeLinksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomizeLinksComponent]
    });
    fixture = TestBed.createComponent(CustomizeLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
