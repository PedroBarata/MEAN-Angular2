import { Post } from "./post.model";
import { Injectable } from "../../../node_modules/@angular/core";
import { Subject } from "../../../node_modules/rxjs";
import { HttpClient } from "../../../node_modules/@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "../../../node_modules/@angular/router";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({ providedIn: "root" })
//Ao inves de colocar no app.module, providers, pode-se declarar um escaneamento de serviços dessa forma
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostsData => {
        this.posts = transformedPostsData.posts; //Não tem necessidade de duplicá-lo pois vem do servidor, não vai ser modificado
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPosts
        }); //Copia um array para um novo, sem mexer no array original (boa prática)
      });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>(BACKEND_URL + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData(); //Formato que aceita strings e blobs (arquivos)
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image); //Tem que ser o mesmo nome que está no multer, no node
    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
      //Não precisa mais dessa parte comentada em /* */ pois a lista será sempre atualizada assim que acontecer alguma coisa com ela!
      /*   const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        //const id = responseData.postId;
        //post.id = id; //Pode se passar diretamente, pois não estamos referenciando um objeto, e sim a PROPRIEDADE (dando um overload na propriedade)
        this.posts.push(post); //Não tem necessidade de duplicá-lo pois vem do servidor, não vai ser modificado
        this.postsUpdated.next([...this.posts]); //Copia um array para um novo, sem mexer no array original (boa prática)
        */ this.router.navigate(["/"]);
      });
  }

  updatePost(
    idPost: string,
    title: string,
    content: string,
    image: File | string
  ) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", idPost);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: idPost,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + idPost, postData)
      .subscribe(response => {
        //Aqui também!
        /* const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === idPost);
        const post: Post = {
          id: idPost,
          title: title,
          content: content,
          imagePath: ""
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]); */
        this.router.navigate(["/"]);
      });
  }

  deletePost(idPost: string) {
      //Aqui também!
    return this.http
      .delete(BACKEND_URL + idPost);
      // .subscribe(() => {

        /* Dentro da condição, o que for falso não vai entrar no novo array (postsUpdated), onde
        no nosso caso, a condição é o id ser diferente do id do post que foi excluído. */
/*         const updatedPosts = this.posts.filter(post => post.id !== idPost);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]); */
      // });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
}
