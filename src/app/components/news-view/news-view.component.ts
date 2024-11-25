import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { User } from '../../models/user';
import { News } from '../../models/news';
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
    private newsService: NewsService, private router: Router) {}
    // Fetch the news from Firebase
    ngOnInit(): void {
      const newsKey = this.route.snapshot.paramMap.get('key');  // Obtener la clave de la noticia de la URL
    
      // Retorno temprano si no se encuentra newsKey
      if (!newsKey) {
        this.news = null;
        return;
      }
    
      // Usamos el servicio para obtener la noticia por su clave
      this.newsService.getNewsByKey(newsKey).pipe(
        catchError((error) => {
          console.error('Error fetching news:', error);
          this.news = null;
          return EMPTY;  // Regresar un observable vacío en caso de error
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
                // Redirigir a 'not-found' si no se encuentran los datos del usuario
                this.router.navigate(['not-found']);
              }
            }).catch(error => {
              console.log('Error al obtener los datos del usuario:', error);
              // Redirigir a 'not-found' en caso de error al obtener los datos del usuario
              this.router.navigate(['not-found']);
            });
          } else {
            console.error('Noticia no encontrada');
            this.news = null;  // Si no se encuentra la noticia, asignar null
            // Redirigir a 'not-found' si no se encuentra la noticia
            this.router.navigate(['not-found']);
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
