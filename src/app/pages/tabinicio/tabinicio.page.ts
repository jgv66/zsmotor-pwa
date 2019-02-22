import { Component, OnInit, Injectable } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { FuncionesService } from 'src/app/services/funciones.service';
import { AlertController } from '@ionic/angular';

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
               private alertCtrl: AlertController ) {
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

  cargaBodegas( producto ) {
    this.funciones.cargaEspera();
    this.datos.traeUnSP( 'ksp_BodegaProducto',
                          { codproducto: producto.codigo, usuario: this.usuario, empresa: '01' },
                          {codigo: this.usuario.KOFU, nombre: this.usuario.NOKOFU } )
        .subscribe( data => { this.funciones.descargaEspera(); this.revisaEoFBP( producto, data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION', err );  }
                  );
  }

  private revisaEoFBP( producto, data ) {
    const rs    = data.recordset;
    const largo = rs.length;
    if ( rs === undefined || largo === 0 ) {
      this.funciones.msgAlert('ATENCION',
                              'Producto sin stock, sin asignación a bodegas o usted no tiene permiso para revisar todas las bodegas.');
    } else if ( largo > 0 ) {
      this.seleccionarBodega( producto, rs );
    }
  }

  async seleccionarBodega( producto, bodegas ) {
    if ( bodegas.length ) {
        const bodconst: any = {};
        //
        bodegas.forEach( element => {
          bodconst.push( { name: element.bodega,
                           type: 'radio',
                           label: 'Stock: ' + element.stock_ud1.toString() + ' [ ' + element.nombrebodega.trim() + ' ]' ,
                           value: element });
        });
        //
        const alert = await this.alertCtrl.create({
          header: 'Bodegas con stock para : ' + producto.codigo,
          inputs: bodconst,
          buttons: [ {  text: 'Cancelar',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => { console.log('Confirm Cancel'); }
                      },
                      { text: 'Ok',
                        handler: data => { this.cambiaListaProductos( data, producto, 1 ); }
                      }
                    ]} );

        await alert.present();
    } else {
        this.funciones.msgAlert('ATENCION',
                                'Producto sin stock o sin asignación a bodegas o sin permiso para revisar todas las bodegas.' );
    }
  }

  cambiaListaProductos( data, producto, caso ) {
    let i = 0;
    if ( caso === 1 ) {
      this.listaProductos.forEach( element => {
        if ( this.listaProductos[i].codigo === producto.codigo ) {
            producto.stock_ud1    = data.stock_ud1;
            producto.bodega       = data.bodega;
            producto.sucursal     = data.sucursal;
            producto.nombrebodega = data.nombrebodega;
            producto.apedir       = 1;
        }
        ++i;
      });
    } else if ( caso === 2 ) {
      this.listaProductos.forEach( element => {
        if ( this.listaProductos[i].codigo === producto.codigo ) {
            producto.precio       = data.precio1;
            producto.preciomayor  = data.preciomayor1;
            producto.montolinea   = data.montolinea1;
            producto.descuentomax = data.descuentomax1;
            producto.dsctovalor   = data.dsctovalor1;
            producto.tipolista    = data.tipolista;
            producto.metodolista  = data.metodolista;
            producto.listaprecio  = data.listaprecio;
          };
        ++i;
      });
    }
  }

}
