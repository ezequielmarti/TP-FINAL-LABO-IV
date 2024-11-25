import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { User } from '../../models/user';
import { News } from '../../models/news';
import { DataService } from '../../services/data.service';
import { NewsService } from '../../services/news.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-news-view',
  templateUrl: './news-view.component.html',
  styleUrls: ['./news-view.component.css']
})
export class NewsViewComponent implements OnInit, OnDestroy {

  news!: News | null;
  update: boolean = false;
  likes: number = 0;
  user!: User;

  constructor(private route: ActivatedRoute, private userService: UserService,
    private newsService: NewsService) {}
    // Fetch the news from Firebase
    ngOnInit(): void {
      const newsKey = this.route.snapshot.paramMap.get('key');  // Get the ID from the URL
  
      // Early return if newsKey is not present
      if (!newsKey) {
        this.news = null;
        return;
      }
  
      // Usamos el servicio para obtener la noticia por su key
      this.newsService.getNewsByKey(newsKey).pipe(
        catchError((error) => {
          console.error('Error fetching news:', error);
          this.news = null;
          return EMPTY;
        })
      ).subscribe({
        next: (response) => {
          if (response) {
            this.news = response;
            console.log('news:', this.news);
            this.likes = this.news.likeLength();
  
            // Obtener los datos del usuario solo después de que Firebase haya verificado el estado de autenticación
            this.userService.getUserData().then(userData => {
              if (userData) {
                this.user = userData;
                console.log('user:', this.user);
              } else {
                console.log('No se encontraron datos del usuario');
              }
            }).catch(error => {
              console.log('Error al obtener los datos del usuario:', error);
            });
          } else {
            console.error('Noticia no encontrada');
            this.news = null;  // Si no se encuentra la noticia, se asigna null
          }
        }
      });
    }

  // Incrementa o decrementa el contador de likes
  likeNews(): void {
    if (this.news && this.news.like(this.user.key)) {
      this.likes++;
    } else {
      this.likes--;
    }
    this.update = !this.update;
  }

  ngOnDestroy(): void {
    // Si los likes fueron modificados, actualiza la noticia en Firebase
    if (this.update && this.news && this.user) {
      this.newsService.addLikeToNews(this.news.key, this.user.key);
    }
  }
}
