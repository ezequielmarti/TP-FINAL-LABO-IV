import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSubject = new BehaviorSubject<string | null>(null);  // Inicializa con null

  // Observable para que los componentes se suscriban
  message$ = this.messageSubject.asObservable();

  // Método para emitir un mensaje
  showMessage(message: string) {
    this.messageSubject.next(message);  // Emitir el mensaje

    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
      this.messageSubject.next(null);  // El mensaje desaparece
    }, 3000);  // 5000 ms = 5 segundos
  }

  // Método para limpiar el mensaje manualmente
  clearMessage() {
    this.messageSubject.next(null);
  }
}
