import { Component, OnDestroy, OnInit } from '@angular/core';
import { News } from '../../models/news';
import { ActivatedRoute, Router } from '@angular/router';

import { NewsService } from '../../services/news.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.css'
})
export class NewsListComponent implements OnInit, OnDestroy{
  newsList: News[] = [];
  // Definir cuántas noticias mostrar por página
  itemsPerPage: number = 18;
  // Definir el número de página actual
  currentPage: number = 1;
  private routeSub: Subscription | undefined;

  constructor(private router: Router, private list:NewsService, private route: ActivatedRoute){}
  

  ngOnInit(): void {
    // Primero, suscríbete a los cambios en los parámetros de la ruta
    this.routeSub = this.route.paramMap.subscribe(params => {
      // Captura el valor de la categoría de los parámetros de la URL
      const category = params.get('category');

      if (category) {
        this.categoryList(category);  // Llamar a la función para manejar la nueva categoría
      } else {
        this.home();  // Si no hay categoría, carga las noticias generales
      }
    });
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción al salir del componente para evitar fugas de memoria
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  home() {
    this.list.getNewsList().subscribe(response => {
      this.newsList = response;
    }); 
    this.list.loadList();
  }

  categoryList(category: string) {
    this.list.getCategoryList(category).subscribe(newsList => {
      this.newsList = newsList;
    });
  }

  onNewsClick(news: News) {
    this.router.navigate(['/news', news.key]);
  }
}

