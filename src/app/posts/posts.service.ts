import { Post } from "./post.model";
import { Injectable } from "../../../node_modules/@angular/core";
import { Subject } from "../../../node_modules/rxjs";
import { HttpClient } from "../../../node_modules/@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "../../../node_modules/@angular/router";
@Injectable({ providedIn: "root" })
//Ao inves de colocar no app.module, providers, pode-se declarar um escaneamento de serviços dessa forma
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}
  getPosts() {
    this.http
      .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts; //Não tem necessidade de duplicá-lo pois vem do servidor, não vai ser modificado
        this.postsUpdated.next([...this.posts]); //Copia um array para um novo, sem mexer no array original (boa prática)
      });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      "http://localhost:3000/api/posts/" + id
    );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData(); //Formato que aceita strings e blobs (arquivos)
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image); //Tem que ser o mesmo nome que está no multer, no node
    this.http
      .post<{ message: string; postId: string }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(responseData => {
        const post: Post = {
          id: responseData.postId,
          title: title,
          content: content
        };
        //const id = responseData.postId;
        //post.id = id; //Pode se passar diretamente, pois não estamos referenciando um objeto, e sim a PROPRIEDADE (dando um overload na propriedade)
        this.posts.push(post); //Não tem necessidade de duplicá-lo pois vem do servidor, não vai ser modificado
        this.postsUpdated.next([...this.posts]); //Copia um array para um novo, sem mexer no array original (boa prática)
        this.router.navigate(["/"]);
      });
  }

  updatePost(idPost: string, title: string, content: string) {
    let post = { id: idPost, title: title, content: content };
    this.http
      .put("http://localhost:3000/api/posts/" + idPost, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(idPost: string) {
    this.http
      .delete("http://localhost:3000/api/posts/" + idPost)
      .subscribe(() => {
        /* Dentro da condição, o que for falso não vai entrar no novo array (postsUpdated), onde
        no nosso caso, a condição é o id ser diferente do id do post que foi excluído. */
        const updatedPosts = this.posts.filter(post => post.id !== idPost);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
}
