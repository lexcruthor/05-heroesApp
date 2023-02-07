import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Auth } from '../interfaces/auth.interfaces';
import { tap, Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  private _auth: Auth | undefined;

get auth(): Auth{
  return {...this._auth!}
}
  constructor(private http : HttpClient) { }
  
verificarAutenticacion(): Observable <boolean>{

  if (!localStorage.getItem('token')) { //si no hay token almacenado:
    return of (false); //no tiene acceso... el of(XX) sirve para transformar un booleano en observable
  }
  // si hay token almacenado:
  return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`)
  .pipe(
    map( auth => {
      this._auth = auth;
      return true
    })
  )
}

  login(){
    return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`)
    .pipe (
      tap(auth => this._auth = auth ),
      tap(auth => localStorage.setItem('token',auth.id) ) //se graba el ID en el local storage para que al refrescar la página el usuario mantenga la sesión
    );
  }
}
