import { Component, Input, OnInit, OnDestroy } from "../../../../node_modules/@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "../../../../node_modules/rxjs";


@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

    // @Input() posts: Post[] = []; 
   
    posts: Post[] = [];
    postsSub: Subscription;

    constructor(public postsService: PostsService) {
    }

    ngOnInit() {
        this.posts = this.postsService.getPosts();
        this.postsSub = this.postsService.getPostUpdateListener()
        .subscribe((posts: Post[] ) => {
            this.posts = posts;
        })
    }

    ngOnDestroy() { 
        //Como é singlepage, esse componente sempre ficará ouvindo, mesmo que nao esteja no DOM,
        // Por isso é bom remover o subscribe ao sair da pagina
        this.postsSub.unsubscribe();
    }

}