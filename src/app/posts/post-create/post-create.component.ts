import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators
} from "../../../../node_modules/@angular/forms";
import { PostsService } from "../posts.service";
import {
  ActivatedRoute,
  ParamMap
} from "../../../../node_modules/@angular/router";
import { Post } from "../post.model";

@Component({
  selector: "app-post-create",
  templateUrl: "post-create.component.html",
  styleUrls: ["post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  //Usa o decorator @Output para dizer que essa variavel vai ser "exportada"
  // @Output() postCreated = new EventEmitter<Post>();

  /* onAddPost(form: NgForm) {
        let post: Post = {
            title: form.value.title,
            content: form.value.content
        };
        this.postCreated.emit(post); //Dá um emit para o componente "pai" (que usa o selector) pegar o evento.
    } */

  enteredTitle = "";
  enteredContent = "";
  private mode = "create";
  private postId: string;
  post: Post;
  form: FormGroup;
  isLoading = false;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(post => {
          this.isLoading = false;
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }
    this.form.reset();
  }
}
