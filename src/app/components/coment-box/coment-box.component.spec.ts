import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentBoxComponent } from './coment-box.component';

describe('ComentBoxComponent', () => {
  let component: ComentBoxComponent;
  let fixture: ComponentFixture<ComentBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComentBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComentBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
