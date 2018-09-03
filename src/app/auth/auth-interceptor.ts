import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";

@Injectable()/* Anotação para injetar serviços dentro de serviços */
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    /* Não é bom mexer com a requisição diretamente, para isso clonamos. */
    /* Adicionamos o header, com o mesmo nome que estamos esperando no backend: "authorization" */
    const authRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });

    return next.handle(authRequest);
  }
}
