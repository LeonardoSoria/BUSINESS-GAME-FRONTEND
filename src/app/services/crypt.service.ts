import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptService {

  constructor() { }

  /**
   * @param value Recibe un string para encriptarlo
   * @returns Retorna el mismo string encriptado con SHA1
   */
  encrypt(value: string): string{
    return CryptoJS.SHA1(value).toString();
  }
}
