import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabinicioPage } from './tabinicio.page';

describe('TabinicioPage', () => {
  let component: TabinicioPage;
  let fixture: ComponentFixture<TabinicioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabinicioPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabinicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
