import { Component, Output, EventEmitter } from '@angular/core';
import { Post } from '../post.model';

@Component({
    selector: 'app-post-create',
    templateUrl: 'post-create.component.html',
    styleUrls: ['post-create.component.css']
})

export class PostCreateComponent {
    enteredTitle = ''
    enteredContent = ''
     //Usa o decorator @Output para dizer que essa variavel vai ser "exportada"
    @Output() postCreated = new EventEmitter<Post>();

    onAddPost() {
        let post: Post = {
            title: this.enteredTitle,
            content: this.enteredContent
        };
        this.postCreated.emit(post); //Dá um emit para o componente "pai" (que usa o selector) pegar o evento.
    }

}