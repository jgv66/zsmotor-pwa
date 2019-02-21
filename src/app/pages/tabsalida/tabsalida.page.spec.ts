import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsalidaPage } from './tabsalida.page';

describe('TabsalidaPage', () => {
  let component: TabsalidaPage;
  let fixture: ComponentFixture<TabsalidaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsalidaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsalidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
