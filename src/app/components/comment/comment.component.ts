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
  userNames: { [userId: string]: string } = {};  // Almacenamos los nombres de los usuarios por ID

  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Obtener el newsId de la URL y cargar los comentarios
    this.route.paramMap.subscribe(params => {
      this.newsId = params.get('key') || '';
      this.loadComments();
    });

    // Obtener el usuario logueado (si es necesario para el comentario)
    this.loadUserData();
  }

  loadComments(): void {
    if (this.newsId) {
      this.commentService.getCommentsByNews(this.newsId).then((comments) => {
        this.comments = comments;
        this.loadUserNames(comments);  // Cargar los nombres de los usuarios
      }).catch((error) => {
        console.error('Error al cargar los comentarios:', error);
      });
    }
  }

  // Cargar los nombres de los usuarios (de cada comentario)
  loadUserNames(comments: Comment[]): void {
    comments.forEach((comment) => {
      if (!this.userNames[comment.userId]) {
        // Llamar solo si no hemos cargado ya el nombre de este usuario
        this.getUserName(comment.userId).then(userName => {
          this.userNames[comment.userId] = userName;  // Almacenar el nombre
        });
      }
    });
  }

  // Función para obtener el nombre del usuario
  getUserName(userId: string): Promise<string> {
    return this.userService.getUserDataById(userId).then(userData => {
      return userData ? userData.userName : 'Desconocido';  // Retornar nombre o 'Desconocido'
    }).catch(() => {
      return 'Desconocido';  // En caso de error (aunque en tu caso no se espera)
    });
  }

  // Función para agregar un nuevo comentario (simplificado)
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
    }
  }

  deleteComment(commentKey: string): void {
    if (this.user) {
      const comment = this.comments.find(c => c.key === commentKey);
      if (comment && comment.userId === this.user.key) {
        this.commentService.deleteComment(commentKey).then(() => {
          this.loadComments();  // Recargar los comentarios después de eliminar uno
        }).catch((error) => {
          console.error('Error al eliminar el comentario:', error);
        });
      } else {
        console.warn('No puedes eliminar este comentario, no eres el propietario.');
      }
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

  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }
}