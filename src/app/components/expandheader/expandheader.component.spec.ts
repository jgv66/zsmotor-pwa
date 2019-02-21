import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandheaderPage } from './expandheader.page';

describe('ExpandheaderPage', () => {
  let component: ExpandheaderPage;
  let fixture: ComponentFixture<ExpandheaderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandheaderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandheaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
