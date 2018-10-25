import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
  private token: string;
  private tokenTimer: any; //Nao reconheceu o NodeJs.Timer, por isso o any
  private isAuthenticated = false;
  private userId: string;
  private authListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthListener() {
    return this.authListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http
      .post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http
      .post<{ token: string, expiresIn: number, userId: string }>(
        "http://localhost:3000/api/user/login",
        authData
      )
      .subscribe(response => {
        const token = response.token;
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
          const now = new Date();
          this.userId = response.userId;
          /* Soma-se a expiração à data atual, em milisegundos */
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.authListener.next(true);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(["/"]);
        }
      });
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.authListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if(!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    /* Se o tempo de expiração for maior que zero, quer dizer que a data de expiração é maior
    que a data atual, logo é um token válido */
    if(expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000); /* divide por 1000 pois depois ele multiplica, e já está em ms */
      this.authListener.next(true);
    }
  }

  /* SetTimeOut é uma função que é executada após determinado tempo,
        nesse caso, depois do tempo de duração do token, em milisegundos,
        ele executa o logout da aplicacao */
  /* Ele é armazenado numa variável, para depois do logout, ser zerada (clear) */

  private setAuthTimer(duration: number) {
    console.log("Setting timer:", duration);

    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  /* Aqui é interessante passar um Date e não um número,
  que é um número relativo e não teremos uma ideia clara
  da data quando voltarmos no futuro */
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);

  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if(!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      userId: userId,
      expirationDate: new Date(expirationDate)
    }
  }
  /* OBS: SEMPRE QUE FOR GRAVAR UMA DATA, PASSE PARA ISOSTRING! SEMPRE QUE FOR EXIBÍ-LA, PASSE PARA DATE */
}
