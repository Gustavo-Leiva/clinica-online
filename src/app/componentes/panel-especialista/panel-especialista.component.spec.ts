import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelEspecialistaComponent } from './panel-especialista.component';

describe('PanelEspecialistaComponent', () => {
  let component: PanelEspecialistaComponent;
  let fixture: ComponentFixture<PanelEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelEspecialistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
