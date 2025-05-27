import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrdensComponent } from './view-ordens.component';

describe('ViewOrdensComponent', () => {
  let component: ViewOrdensComponent;
  let fixture: ComponentFixture<ViewOrdensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewOrdensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOrdensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
