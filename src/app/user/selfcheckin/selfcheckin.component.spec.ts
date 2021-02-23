import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfcheckinComponent } from './selfcheckin.component';

describe('SelfcheckinComponent', () => {
  let component: SelfcheckinComponent;
  let fixture: ComponentFixture<SelfcheckinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfcheckinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfcheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
