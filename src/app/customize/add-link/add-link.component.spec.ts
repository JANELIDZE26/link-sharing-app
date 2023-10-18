import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLinkComponent } from './add-link.component';

describe('AddLinkComponent', () => {
  let component: AddLinkComponent;
  let fixture: ComponentFixture<AddLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLinkComponent]
    });
    fixture = TestBed.createComponent(AddLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
