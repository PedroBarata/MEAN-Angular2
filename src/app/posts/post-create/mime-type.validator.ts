import { AbstractControl } from "../../../../node_modules/@angular/forms";
import { Observable, Observer, of } from "../../../../node_modules/rxjs";

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  const file = control.value as File;
  const fileReader = new FileReader();
  const fileReaderObs = Observable.create((observer: Observer<{[key: string]: any}>) => {
    if(typeof(control.value) === 'string') {
      return of(null);
      //(of) é uma forma rápida de retornar um observable que emite o dado imediatamente,
      //retornando null, significa válido
    }

    /* Não foi usado o loadend direto porque necessitamos de algumas funções extras que o
    / addEventListener tem. */
    fileReader.addEventListener("loadend", () => {
      //No mimeType é nesse subarray que fica as informações necessárias para saber o tipo do arquivo
      const arr = new Uint8Array(fileReader.result).subarray(0,4);
      let header = "";
      let isValid = false;
      for(let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16); //Pega-se cada subarray e concatena no header.
      }
      //E checa os padrões dos formatos. Para mais, basta procurar "JavaScript file mimeType"
      switch (header) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }
      if(isValid) {
        observer.next(null); //Isso indica que não há nenhum erro "null"
      } else {
        observer.next( { invalidMimeType: true } ) //Retorna um json com um erro, pode ser um nome qualquer.
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });
  return fileReaderObs; //E retorna o observable
};
