import {
  Component,
  OnInit,
  OnDestroy
} from "../../../node_modules/@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authStatusSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    /* Pela mesma razão do post list:
    Pode ser que o componente do header esteja sendo carregado um pouco tarde demais
    e por isso não está conseguindo pegar a troca do estado de autenticação do appcomponent.
    Ou seja, o autoAuthUser está sendo executado ANTES de carregar o cabeçalho.
    Por isso, devemos executar a linha abaixo: */
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
