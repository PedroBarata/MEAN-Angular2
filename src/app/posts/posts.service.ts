import { Post } from "./post.model";
import { Injectable } from "../../../node_modules/@angular/core";
import { Subject } from "../../../node_modules/rxjs";

@Injectable({providedIn: 'root'}) 
//Ao inves de colocar no app.module, providers, pode-se declarar um escaneamento de serviços dessa forma
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    getPosts() {
        return [...this.posts]; //Copia um array para um novo, sem mexer no array original (boa prática)
    }

    addPost(title: string, content: string) {
        let post = {title: title, content: content};
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }
}