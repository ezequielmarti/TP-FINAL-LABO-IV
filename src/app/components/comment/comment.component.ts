import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { CommentService } from '../../services/comment.service';
import { UserService } from '../../services/user.service';
import { Comment } from '../../models/comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  newsId: string = '';  // ID de la noticia (lo obtenemos de la URL)
  comments: Comment[] = [];  // Lista de comentarios
  newCommentContent: string = '';  // Contenido del nuevo comentario
  user: User | null = null;  // Datos del usuario logueado

  constructor(
    private route: ActivatedRoute,  // Para obtener parámetros de la URL
    private commentService: CommentService,  // Servicio para manejar comentarios
    private userService: UserService  // Servicio para obtener los datos del usuario logueado
  ) {}

  ngOnInit(): void {
    // Obtener el newsId de la URL
    this.route.paramMap.subscribe(params => {
      this.newsId = params.get('key') || '';  // Obtenemos el newsId (key) desde la URL
      this.loadComments();  // Cargamos los comentarios de la noticia
    });
    // Obtener el usuario logueado
    this.loadUserData();  // Cargar los datos del usuario logueado
  }

  // Función para cargar los comentarios de la noticia
  loadComments(): void {
    if (this.newsId) {
      this.commentService.getCommentsByNews(this.newsId).then((comments) => {
        this.comments = comments;
      }).catch((error) => {
        console.error('Error al cargar los comentarios:', error);
      });
    }
  }

  // Función para cargar el usuario logueado
  async loadUserData(): Promise<void> {
    try {
      this.user = await this.userService.getUserData();
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  }

  // Función para agregar un nuevo comentario
  addComment(): void {
    if (this.user && this.newCommentContent.trim()) {
      const newComment = new Comment(
        this.user.key,  // userId del usuario logueado
        this.newsId,
        Date.now(),  // Timestamp actual
        this.newCommentContent
      );

      this.commentService.addComment(newComment).then(() => {
        this.loadComments();  // Recargar los comentarios después de agregar uno nuevo
        this.newCommentContent = '';  // Limpiar el campo de contenido
      }).catch((error) => {
        console.error('Error al agregar el comentario:', error);
      });
    } else {
      console.warn('El contenido del comentario está vacío o el usuario no está logueado.');
    }
  }

  // Función para eliminar un comentario
  deleteComment(commentKey: string): void {
    this.commentService.deleteComment(commentKey).then(() => {
      this.loadComments();  // Recargar los comentarios después de eliminar uno
    }).catch((error) => {
      console.error('Error al eliminar el comentario:', error);
    });
  }

  /*
  getUserName(userId: string): string {
    let userName = 'Desconocido';
    this.userService.getUserDataById(userId).then(userData => {
      userName = userData ? userData.userName : 'Desconocido';
    }).catch(() => {
      userName = 'Desconocido';
    });
    return userName;
  }*/

  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }
}