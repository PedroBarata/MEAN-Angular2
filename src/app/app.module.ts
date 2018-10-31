import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";


import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";

import { HeaderComponent } from "./header/header.component";
import {
  HttpClientModule,
  HTTP_INTERCEPTORS
} from "../../node_modules/@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";

import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from "./error/error.component";
import { AngularMaterialModule } from "./angular-material.module";
import { PostModule } from "./posts/post.module";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,

    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PostModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  /* Diz que um componente vai ser usado, mesmo se o Angular não enxergá-lo */
 entryComponents: [ErrorComponent]
})
export class AppModule {}
