import { Component } from '@angular/core';
import { NgForm } from '../../../../node_modules/@angular/forms';
import { PostsService } from '../posts.service';

@Component({
    selector: 'app-post-create',
    templateUrl: 'post-create.component.html',
    styleUrls: ['post-create.component.css']
})

export class PostCreateComponent {
     //Usa o decorator @Output para dizer que essa variavel vai ser "exportada"
    // @Output() postCreated = new EventEmitter<Post>();

    /* onAddPost(form: NgForm) {
        let post: Post = {
            title: form.value.title,
            content: form.value.content
        };
        this.postCreated.emit(post); //Dá um emit para o componente "pai" (que usa o selector) pegar o evento.
    } */

    constructor(public postsService: PostsService) {}

    onAddPost(form: NgForm) {
        this.postsService.addPost(form.value.title, form.value.content); 
    }


}