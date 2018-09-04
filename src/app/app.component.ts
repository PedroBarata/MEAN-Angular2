import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

/*   storedPosts: Post[] = [];
  onAddedPost(post) {
    this.storedPosts.push(post);
  } */

  constructor(private authService: AuthService) {}

  /* Colocamos o autoAuth no appcomponent, pois é o primeiro componente que é chamado ao carregar a aplicação */
  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
