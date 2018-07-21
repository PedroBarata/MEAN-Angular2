import { Post } from "./post.model";
import { Injectable } from "../../../node_modules/@angular/core";
import { Subject } from "../../../node_modules/rxjs";
import { HttpClient } from "../../../node_modules/@angular/common/http";
@Injectable({providedIn: 'root'})
//Ao inves de colocar no app.module, providers, pode-se declarar um escaneamento de serviços dessa forma
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) {

    }
    getPosts() {
      this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
      .subscribe((postData) => {
        this.posts = postData.posts; //Não tem necessidade de duplicá-lo pois vem do servidor, não vai ser modificado
        this.postsUpdated.next([...this.posts]); //Copia um array para um novo, sem mexer no array original (boa prática)
      });
    }

    addPost(title: string, content: string) {
        let post = {id: null, title: title, content: content};
        this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
        .subscribe((responseData) => {
          console.log(responseData);
          this.posts.push(post); //Não tem necessidade de duplicá-lo pois vem do servidor, não vai ser modificado
          this.postsUpdated.next([...this.posts]); //Copia um array para um novo, sem mexer no array original (boa prática)
        });
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }
}
