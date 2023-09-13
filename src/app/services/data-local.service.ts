import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage-angular';
import { privateDecrypt } from 'crypto';
import { NavController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  constructor(
    private storage: Storage,
    private navCtrl: NavController
    ) {

   this.init();
  }

   async init() {
    await this.storage.create();
    this.storage.get('registros').then( registros => {
      this.guardados = registros || [];
    });
  }

  async saveRegistro(format: string, text: string) {

    const newRegistro = new Registro( format, text );
    this.guardados.unshift(newRegistro);

    this.storage.set('registros', this.guardados);

    this.openRegister( newRegistro )

  }

  async openRegister( registro: Registro ){

    this.navCtrl.navigateForward('/tabs/tab2');

    switch ( registro.format ) {
      case 'URL':
        await Browser.open({ url: registro.text });
        break;

      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${ registro.text }`);
        break;

      default:
        break;
    }
  }
}
