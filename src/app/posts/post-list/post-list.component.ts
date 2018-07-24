import {
  Component,
  Input,
  OnInit,
  OnDestroy
} from "../../../../node_modules/@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "../../../../node_modules/rxjs";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // @Input() posts: Post[] = [];

  posts: Post[] = [];
  isLoading = false;
  postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onDelete(idPost: string) {
    this.postsService.deletePost(idPost);
  }

  ngOnDestroy() {
    //Como é singlepage, esse componente sempre ficará ouvindo, mesmo que nao esteja no DOM,
    // Por isso é bom remover o subscribe ao sair da pagina
    this.postsSub.unsubscribe();
  }
}
