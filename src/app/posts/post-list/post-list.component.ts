import { Component, Input } from "../../../../node_modules/@angular/core";


@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent {

    // posts = [
    //     {title: 'The first post', content: 'The first post content'},
    //     {title: 'The second post', content: 'The second post content'},
    //     {title: 'The third post', content: 'The third post content'},
    // ];

    @Input() posts = [];

}