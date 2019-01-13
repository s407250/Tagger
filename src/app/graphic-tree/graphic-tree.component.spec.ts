import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicTreeComponent } from './graphic-tree.component';

describe('GraphicTreeComponent', () => {
  let component: GraphicTreeComponent;
  let fixture: ComponentFixture<GraphicTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
