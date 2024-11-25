import { Injectable } from '@angular/core';
import { getDatabase, ref, set, push, get, remove } from 'firebase/database';
import { Comment } from '../models/comment' ;

@Injectable({
  providedIn: 'root'
})

export class CommentService {

  constructor() {}

  addComment(comment: Comment): Promise<void> {
    const db = getDatabase();
    const commentsRef = ref(db, 'comments');  // Ruta donde se almacenarán los comentarios

    const newCommentRef = push(commentsRef);
    return set(newCommentRef, {
      userId: comment.userId,
      newsId: comment.newsId,
      timestamp: comment.timestamp,
      content: comment.content
    }).then(() => {
      console.log('Comentario agregado con éxito');
    }).catch((error) => {
      console.error('Error al agregar el comentario:', error);
      throw error;
    });
  }

  /**
   * Obtiene todos los comentarios de una noticia específica
   * @param newsId El ID de la noticia para filtrar los comentarios
   * @returns Una promesa que resuelve en un arreglo de comentarios
   */
  getCommentsByNews(newsId: string): Promise<Comment[]> {
    const db = getDatabase();
    const commentsRef = ref(db, 'comments');
    
    return get(commentsRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const commentsData = snapshot.val();
          const comments: Comment[] = [];

          for (const key in commentsData) {
            if (commentsData.hasOwnProperty(key)) {
              const comment = commentsData[key];
              if (comment.newsId === newsId) {
                comments.push(new Comment(
                  comment.userId,
                  comment.newsId,
                  comment.timestamp,
                  comment.content,
                  key
                ));
              }
            }
          }
          return comments;  // Devuelve la lista de comentarios filtrados por newsId
        } else {
          return [];  // Si no existen comentarios, devolvemos un arreglo vacío
        }
      })
      .catch(error => {
        console.error('Error al obtener los comentarios:', error);
        throw error;
      });
  }

  /**
   * Elimina un comentario de Firebase
   * @param commentKey La clave del comentario a eliminar
   * @returns Promesa con la respuesta de la base de datos
   */
  deleteComment(commentKey: string): Promise<void> {
    const db = getDatabase();
    const commentRef = ref(db, `comments/${commentKey}`);
    
    return remove(commentRef)
      .then(() => {
        console.log('Comentario eliminado con éxito');
      })
      .catch((error) => {
        console.error('Error al eliminar el comentario:', error);
        throw error;
      });
  }
}
