import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.css'
})
export class NavigatorComponent {

  constructor(private router: Router){}

  homeNavigate(){
    this.router.navigate(['/']);
  }

  onNavigate(navigate: string) {
    this.router.navigate(['/news-list', navigate]);
  }
}
