import { Component, OnInit } from '@angular/core';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'coneccion';

  message: string | null = null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Nos suscribimos al mensaje
    this.notificationService.message$.subscribe((message) => {
      this.message = message;  // Actualizamos el mensaje cuando cambie
    });
  }
}
