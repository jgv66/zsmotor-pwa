import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-listprod',
  templateUrl: './listprod.component.html',
  styleUrls: ['./listprod.component.scss'],
})
export class ListprodComponent implements OnInit {

  @Input() listaProductos;
  @Input() config;
  @Input() usuario;

  constructor() { }

  ngOnInit() {}

}
