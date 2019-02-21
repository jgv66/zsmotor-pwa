import { Component, OnInit, Renderer, ElementRef } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { FuncionesService } from 'src/app/services/funciones.service';

@Component({
  selector: 'app-tabinicio',
  templateUrl: './tabinicio.page.html',
  styleUrls: ['./tabinicio.page.scss'],
})
export class TabinicioPage implements OnInit {

  //
  headerHeight    = 150;
  newheaderHeight: any;
  //
  lScrollInfinito = false;
  offset          = 0;
  scrollSize      = 20;
  codproducto     ;
  descripcion     ;
  usuario         ;
  cliente         ;
  Carro           = [];
  config:         any;
  Importados      = [];
  nombreEmpresa   = '';
  firstcall       = false;
  filtrosVarios   = false;
  tipoTarjeta     = false;
  codSuperFam     = '';
  // get's
  listaProductos  = [];
  pProd           = '';
  pDesc           = '';
  pFami           = '';
  // familias zsmotor   jgv 01-05-2018
  listaFamilias:  any = [{ cod: 'NEUM', descrip: 'Neumáticos'            },
                         { cod: 'LLAN', descrip: 'Llantas'               },
                         { cod: 'AEXT', descrip: 'Accesorios exterior'   },
                         { cod: 'AINT', descrip: 'Accesorios interior'   },
                         { cod: 'ACCL', descrip: 'Accesorios llantas'    },
                         { cod: 'DET ', descrip: 'Detailing'             },
                         { cod: 'ILUM', descrip: 'Iluminación'           },
                         { cod: '4X4 ', descrip: 'Off Road'              },
                         { cod: 'SEGU', descrip: 'Protección y seguridad'},
                         { cod: 'THUL', descrip: 'Thule'                 },
                         { cod: 'TUNI', descrip: 'Tunning'               } ];

  constructor( private datos:     DatosService,
               private funciones: FuncionesService,
               private renderer:  Renderer,
               private element:   ElementRef ) {
    this.filtrosVarios      = false;
    this.codproducto        = '';
    this.descripcion        = '';
    this.codSuperFam        = '';
    this.firstcall          = true;
  }

  ionViewWillEnter() {
    this.firstcall = false;
  }

  ngOnInit() {
    this.datos.obtenUltimoUsuario().then( data => this.usuario = data );
    this.cliente = this.datos.initCliente();
    this.config  = this.datos.initConfig();
  }

  inicializa() {}

  aBuscarProductos( pProducto?, pDescripcion?, pCodFamilias?, xdesde?, infiniteScroll? ) {
    if ( pProducto === '' && pDescripcion === '' && pCodFamilias === '' ) {
      this.funciones.msgAlert('DATOS VACIOS', 'Debe indicar algún dato para buscar...');
    } else {
      //
      if ( xdesde === 1 ) {
        this.funciones.cargaEspera();
        this.offset          = 0 ;
        this.listaProductos  = [];
        this.pProd           = pProducto ;
        this.pDesc           = pDescripcion ;
        this.pFami           = pCodFamilias ;
        this.lScrollInfinito = true;
      } else {
        this.offset += this.scrollSize ;
        pProducto    = this.pProd ;
        pDescripcion = this.pDesc ;
        pCodFamilias = this.pFami ;
      }
      //
      if ( pCodFamilias === this.listaProductos ) {
        pCodFamilias = '';
      }
      // console.log(this.usuario);
      this.datos.traeUnSP( 'ksp_buscarProductos_v8', {  codproducto:   pProducto,
                                                        descripcion:   pDescripcion,
                                                        bodega:        this.usuario.BODEGA,
                                                        offset:        this.offset.toString(),
                                                        usuario:       this.usuario,
                                                        soloconstock:  this.config.soloconstock,
                                                        ordenar:       this.config.ordenar,
                                                        soloverimport: this.config.soloverimport,
                                                        familias:      pCodFamilias } )
          .subscribe( data => { if ( xdesde === 1 ) { this.funciones.descargaEspera(); }
                                this.revisaExitooFracaso( data, xdesde, infiniteScroll ); },
                      err  => { this.funciones.descargaEspera();
                                this.funciones.msgAlert( 'ATENCION', err ); }
                    );
    }
  }

  private revisaExitooFracaso( data, xdesde, infiniteScroll ) {
    const rs    = data.recordset;
    const largo = rs.length;
    if ( rs === undefined || largo === 0 ) {
      this.funciones.msgAlert('ATENCION', 'Su búsqueda no tiene resultados. Intente con otros datos.');
    } else if ( largo > 0 ) {
      //
      this.listaProductos = ( this.offset === 0 ) ? rs : this.listaProductos.concat(rs);
      //
      if ( infiniteScroll ) {
        infiniteScroll.target.complete();
      }
      //
      if ( largo < this.scrollSize ) {
        this.lScrollInfinito = false ;
      } else if ( xdesde === 1 ) {
        this.lScrollInfinito = true ;
      }
    }
  }

  masDatos( infiniteScroll: any ) {
    this.aBuscarProductos( this.pProd, this.pDesc, this.pFami, 0, infiniteScroll );
  }

  masOpciones() {
    this.filtrosVarios = !this.filtrosVarios ;
    if ( !this.filtrosVarios ) {
      this.codSuperFam = '';
    }
  }

  cambiarDespliegue() {
    this.tipoTarjeta = !this.tipoTarjeta;
  }

}
