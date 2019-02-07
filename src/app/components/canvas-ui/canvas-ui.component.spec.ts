import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasUIComponent } from './canvas-ui.component';

describe('CanvasUIComponent', () => {
  let component: CanvasUIComponent;
  let fixture: ComponentFixture<CanvasUIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasUIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
