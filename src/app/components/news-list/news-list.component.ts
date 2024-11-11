import { Component, OnDestroy, OnInit } from '@angular/core';
import { News } from '../../models/news';
import { Router } from '@angular/router';

import { ListManagementService } from '../../services/list-management.service';


@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.css'
})
export class NewsListComponent implements OnInit{
  newsList: News[] = [];
  // Definir cuántas noticias mostrar por página
  itemsPerPage: number = 2;
  
  // Definir el número de página actual
  currentPage: number = 1;

  constructor(private router: Router, private list:ListManagementService){}
  ngOnDestroy(): void {
    this.list.guardar();
  }

  ngOnInit(): void {
    this.list.getNewsList().subscribe(response => {
      this.newsList = response;  // Asignamos la lista de noticias a la variable local
      console.log('Noticias cargadas:', this.newsList);
    });

    // Llamamos a loadList para disparar la carga de noticias
    this.list.loadList();
    
  }

  onNewsClick(news: News) {
    // Navegar al componente de detalles de la noticia pasando el ID de la noticia
    this.router.navigate(['/news', news.id]);
  }


}

