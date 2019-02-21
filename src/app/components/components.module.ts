import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardprodComponent } from './cardprod/cardprod.component';
import { IonicModule } from '@ionic/angular';
import { ListprodComponent } from './listprod/listprod.component';
import { ExpandheaderComponent } from './expandheader/expandheader.component';

@NgModule({
  declarations: [ CardprodComponent, ListprodComponent, ExpandheaderComponent ],
  exports:      [ CardprodComponent, ListprodComponent, ExpandheaderComponent ],
  imports:      [ CommonModule, IonicModule ]
})

export class ComponentsModule { }
