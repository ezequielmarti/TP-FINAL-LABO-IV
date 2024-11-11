import { Component, OnInit } from '@angular/core';
import { News } from '../../models/news';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { NewsListComponent } from '../news-list/news-list.component';

@Component({
  selector: 'app-news-view',
  templateUrl: './news-view.component.html',
  styleUrl: './news-view.component.css'
})
export class NewsViewComponent implements OnInit{
  
  news: News | null = null;
  
  constructor(private route: ActivatedRoute, private newsService: DataService){}

  ngOnInit(): void {
    const newsId = this.route.snapshot.paramMap.get('id');  // Obtener el ID de la URL

    if (newsId) {
      // Convertir el ID de string a número
      const id = parseInt(newsId, 10);

      if (!isNaN(id)) {
        this.newsService.getNewsById(id).subscribe(data => {
          this.news = data;  // Asignar los detalles de la noticia
          console.log(data);
        });
      } else {
        console.error('ID inválido:', newsId);
      }
    }
  }

  likeNews(): void {
    // Añadir un "like" a la noticia, simulando que el usuario dio un "me gusta"
    // Puedes usar un identificador único como el usuario actual si lo prefieres
     // Usamos un número genérico "1" como "like" de ejemplo
  }

}
