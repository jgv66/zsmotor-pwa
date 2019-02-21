import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  loader:          any;
  loading:         any;
  usuario:         any;
  cliente:         any;
  varCliente:      any = [];
  config:          any;
  copiaPendientes: any;
  pendientes:      number;
  misCompras       = 0;
  documento:       any;

  constructor( private loadingCtrl: LoadingController,
               private alertCtrl:   AlertController,
               private toastCtrl:   ToastController ) {
  }

  textoSaludo() {
    const dia   = new Date();
    if ( dia.getHours() >= 8  && dia.getHours() < 12 ) {
      return 'buenos días ';
    } else if ( dia.getHours() >= 12 && dia.getHours() < 19 ) {
      return 'buenas tardes ';
    } else {
      return 'buenas noches '; }
  }

  async cargaEspera( milisegundos?) {
    this.loader = await this.loadingCtrl.create({
      duration: ( milisegundos != null && milisegundos !== undefined ? milisegundos : 3000 )
      });
    await this.loader.present();
  }

  descargaEspera() {
    this.loader.dismiss();
  }

  async msgAlert( titulo, texto ) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: texto,
      buttons: ['OK']
    });
    await alert.present();
  }

  async muestraySale( cTexto, segundos, posicion? ) {
    const toast = await this.toastCtrl.create({
      message: cTexto,
      duration: 1500 * segundos,
      position: posicion || 'middle'
    });
    toast.present();
  }

  nombreMes( nMes, nLargo? ) {
    if      ( nMes === 1 ) {
      return 'Enero'     ;
    } else if ( nMes === 2 ) {
      return (( nLargo ) ? 'Feb' : 'Febrero' ) ;
    } else if ( nMes === 3 ) {
      return 'Marzo'     ;
    } else if ( nMes === 4 ) {
      return 'Abril'     ;
    } else if ( nMes === 5 ) {
      return 'Mayo'      ;
    } else if ( nMes === 6 ) {
      return 'Junio'     ;
    } else if ( nMes === 7 ) {
      return 'Julio'     ;
    } else if ( nMes === 8 ) {
      return 'Agosto'    ;
    } else if ( nMes === 9 ) {
      return 'Septiembre';
    } else if ( nMes === 10) {
      return 'Octubre'   ;
    } else if ( nMes === 11) {
      return 'Noviembre' ;
    } else if ( nMes === 12) {
      return 'Diciembre' ;
    } else {
      return 'n/n'       ;
    }
  }

}
