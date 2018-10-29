import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  templateUrl: './error.component.html'
})
export class ErrorComponent {
  /* Usa o decorator Inject, com o token MAT_DIALOG_DATA: um identificador usado internamente
    para manter os dados e utilizá-lo em algum lugar*/
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) {}

}
