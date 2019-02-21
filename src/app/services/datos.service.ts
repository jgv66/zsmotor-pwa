/*
ionic cordova plugin add cordova-sqlite-storage
npm install --save @ionic/storage
... luego agregar al app.module.ts
 imports: [... IonicStorageModule.forRoot(), ...]
*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class DatosService {

  empresa:        number;
  user:           any;
  cualquierDato:  any;
  xDato:          any;
  loading:        any;
  params:         any;
  url             = 'https://api.kinetik.cl/zsmotor';
  puerto          = '';

  constructor(  private http: HttpClient,
                private loadingCtrl: LoadingController,
                private storage: Storage ) {
      this.user = this.initUsuario();
  }

  initUsuario() {
    return {KOFU: '',
            NOKOFU: '',
            RTFU: '',
            MODALIDAD: null,
            EMAIL: null,
            BODEGA: null,
            LISTAMODALIDAD: null,
            LISTACLIENTE: null,
            SUCURSAL: null,
            EMPRESA: null };
  }

  initCliente() {
    this.user.LISTACLIENTE = '';
    return {codigo: '',
            sucursal: '',
            razonsocial: '',
            direccion: '',
            ciudad: '',
            comuna: '',
            vendedor: '',
            nombrevendedor: '',
            listaprecios: '',
            nombrelista: '',
            email: ''};
  }

  initConfig() {
    return { soloconstock:          false,
             usarlistacli:          false,
             ordenar:               '',
             imagenes:              false,
             ocultardscto:          false,
             puedevercosto:         false,
             puedemoddscto:         false,
             puedemodifdscto:       false };
  }

  async showLoading() {
  this.loading = await this.loadingCtrl.create({
            message: 'Rescatando',
            duration: 7000
          });
    return await this.loading.present();
  }

  /* FUNCIONES LOCALES */
  guardaUltimoUsuario( data ) {
    if ( data.LISTACLIENTE === undefined ) {
      data.LISTACLIENTE = '';
    }
    this.user = data;
    this.storage.set( 'ktp_ultimo_usuario',  this.user );
  }

  obtenUltimoUsuario() {
    return this.storage.get('ktp_ultimo_usuario')
      .then( pUsuario => {
          // console.log('obtenUltimoUsuario()', pUsuario );
          this.user = ( pUsuario == null ? this.initUsuario() : pUsuario );
          if ( this.user.LISTACLIENTE === undefined ) {
            this.user.LISTACLIENTE = '';
          };
          return this.user;
      });
  }

  saveDatoLocal( token: any, dato: any ) {
    this.storage.set( token, JSON.stringify(dato) );
  }

  getSectionData( token: any ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
            this.storage.get( token ).then( data => { resolve(data); });
      } catch (err) {
            reject(err);
      }
    });
  }

  async readDatoLocal(token: any) {
    this.getSectionData( token )
        .then( data => {
                         return data;
                       })
        .catch( () => {
                        return undefined;
                      });
  }

  guardaMientras( dato ) {
    this.cualquierDato = dato;
  }

  rescataMientras() {
    return this.cualquierDato ;
  }

  deleteDatoLocal( token: any ) {
    this.storage.remove( token ).then( () => console.log( 'DatosService.deleteDatoLocal EXISTE y REMOVIDO->', token ) );
  }

  /* FUNCIONES REMOTAS */
  getDataEmpresas(): Observable<any> {   /* debo cambiarlo por GET */
    const body = { datos: { empresa: '01', reporte: 777 }};
    return this.http.post( this.url + '' + this.puerto + '/krpt', body );
  }

  getDataSuperFamilias() {   /* debo cambiarlo por GET */
    return this.http.get( this.url + '' + this.puerto + '/ktp_superfam' );
  }

  getDataUser( proceso: any, email: any, clave: any, empresa: any ): Observable<any> {
    this.showLoading();
    const datos = { rutocorreo: email, clave: clave, empresa: empresa };
    const body  = { sp: 'ksp_buscarUsuario', datos: datos };
    return this.http.post( this.url + this.puerto + '/' + proceso, body )
                    .pipe( tap( value =>  { if ( this.loading ) { this.loading.dismiss(); } }) );
  }

  traeUnSP( cSP: string, parametros?: any, pUser?: any ) {
    const accion = '/proalma';
    const url    = this.url + this.puerto + accion;
    const body   = { sp: cSP, datos: parametros, user: pUser };
    return this.http.post( url, body );
  }

  grabarDocumentos( pCarro, pModalidad, cTipodoc, cTextoObs, cTextoOcc )  {
    // console.log( 'grabadocumentos()->', pCarro );
    const accion = '/grabadocumentos';
    const url    = this.url + this.puerto + accion;
    const body   = { carro: pCarro, modalidad: pModalidad, tipodoc: cTipodoc, cObs: cTextoObs, cOcc: cTextoOcc };
    return this.http.post( url, body );
  }

  // correos
  soloEnviarCorreo( pCarro, cTo, cCc, cTextoObs )  {
    // console.log('soloEnviarCorreo()->', pCarro);
    const accion = '/soloEnviarCorreo';
    const url    = this.url + ':' + this.puerto + accion;
    const body   = { carro: pCarro, cTo: cTo, cCc: cCc, cObs: cTextoObs };
    return this.http.post( url, body );
  }

  sendMail( rutocorreo: string ) {
    const accion = '/sendmail';
    const url    = this.url + ':' + this.puerto + accion;
    const body   = { rutocorreo: rutocorreo };
    return this.http.post( url, body );
  }
}
