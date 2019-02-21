import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FuncionesService } from 'src/app/services/funciones.service';
import { DatosService } from 'src/app/services/datos.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  rutocorreo  = '';
  clave       = '';
  auto_arriba = 0;
  auto_abajo  = 0;

  constructor(  private datos: DatosService,
                private funciones: FuncionesService,
                private router: Router ) {
    console.log('<<< LoginPage >>>');
    // aleatorios para cambiar imagenes
    this.auto_arriba = Math.trunc( (Math.random() * 7) + 1 );
    this.auto_abajo  = Math.trunc( (Math.random() * 7) + 1 );
    //
    if ( this.auto_arriba === this.auto_abajo ) {
      this.auto_abajo = Math.trunc( (Math.random() * 7) + 1 );
    }
  }

  ngOnInit() {
    this.datos.readDatoLocal( 'ktp_ultimo_usuario' )
        .then( pUsuario => {
          try {
                this.rutocorreo = pUsuario.EMAIL.trim();
                this.clave      = pUsuario.RTFU.trim();
                this.clave      = this.clave.slice( 0, 5 );
            } catch (error) {
              this.rutocorreo = '';
              this.clave      = '';
        }
        })
        .catch( err => console.log( 'Lectura de usuario con error->', err ) );
  }

  logearme() {
    if ( this.rutocorreo === '' || this.clave === '' ) {
      this.funciones.msgAlert('Datos vacíos', 'Debe digitar email y clave para ingresar.' );
    } else {
    console.log( '<<< logearme() >>>', this.rutocorreo, this.clave );
    this.funciones.cargaEspera();
    this.datos.traeUnSP(  'ksp_buscarUsuario',
                          { rutocorreo: this.rutocorreo, clave: this.clave },
                          { codigo: this.rutocorreo , nombre: this.rutocorreo } )
        .subscribe( data => { this.funciones.descargaEspera(); this.revisaExitooFracaso( data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION', 'Ocurrió un error -> ' + err ); }
                  );
    }
  }

  private revisaExitooFracaso( data ) {
    // console.log( 'lectura', '->', data );
    const rs = data.recordset[0];
    if ( rs.length === 0 ) {
        this.funciones.msgAlert('ATENCION',
                                'Los datos ingresados no coinciden con usuarios registrados. ' +
                                'Corrija o póngase en contacto con su administrador.');
    } else {
        console.log(rs);
        this.funciones.muestraySale( 'Hola ' + rs.NOKOFU + ', ' + this.funciones.textoSaludo(), 1.5 );
        this.datos.guardaUltimoUsuario( rs );
        this.router.navigate( ['/tabs'] );
    }
  }

}
