import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabfiltrosPage } from './tabfiltros.page';

describe('TabfiltrosPage', () => {
  let component: TabfiltrosPage;
  let fixture: ComponentFixture<TabfiltrosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabfiltrosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabfiltrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
