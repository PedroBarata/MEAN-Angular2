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
