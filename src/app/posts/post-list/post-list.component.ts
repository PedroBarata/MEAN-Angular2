import {
  Component,
  OnInit,
  OnDestroy
} from "../../../../node_modules/@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "../../../../node_modules/rxjs";
import { PageEvent } from "@angular/material";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // @Input() posts: Post[] = [];

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    /* Foi criado esse serviço "a mais" pq o componente "post" é chamado apenas APÓS o login,
    logo, ele não consegue obter a informação de que o booleano do isAuth mudou. Isso significa
    que não está sendo passada a nova informação para o subscribe aqui. Só são enviadas novas informações */
    this.authStatusSub = this.authService
      .getAuthListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(idPost: string) {
    this.isLoading = true;
    this.postsService.deletePost(idPost).subscribe(
      () => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    //Como é singlepage, esse componente sempre ficará ouvindo, mesmo que nao esteja no DOM,
    // Por isso é bom remover o subscribe ao sair da pagina
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
