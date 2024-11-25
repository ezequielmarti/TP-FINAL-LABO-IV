import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})

export class LogInComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: boolean = false;
  showLoginForm: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    // Inicialización del formulario
    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });

    // Suscripción al estado de login
    this.userService.getLoginStatus().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.showLoginForm = false;  // Ocultar formulario de login si el usuario está logueado
      } else {
        this.showLoginForm = false;  // Inicialmente está oculto si no está logueado
      }
    });
  }

  onSubmit() {
    this.userService.logIn(this.loginForm.value)
      .then(() => {
        this.loginError = false;
        this.router.navigate(['/']);  // Navegar a la página principal después de un login exitoso
      })
      .catch(error => {
        this.loginError = true;
        console.log('Error de login', error);  // Para debugging
      });
  }

  // Esta función se llama cuando el usuario hace click en "Log In"
  stateLoginForm() {
    this.showLoginForm = !this.showLoginForm;  // Alterna la visibilidad del formulario
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);  // Navegar al formulario de SignUp
  }

  logOut() {
    this.userService.logOut();  // Llamar al servicio de logout
    this.router.navigate(['/']);  // Redirigir al usuario a la página principal
  }

  isLog(): boolean {
    return this.userService.isLoggedIn();  // Devuelve si el usuario está logueado
  }

}
