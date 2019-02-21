import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardprodPage } from './cardprod.page';

describe('CardprodPage', () => {
  let component: CardprodPage;
  let fixture: ComponentFixture<CardprodPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardprodPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardprodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
