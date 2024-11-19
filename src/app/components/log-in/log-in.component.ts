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
  userName: string = "";

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    // Inicialización del formulario
    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  onSubmit() {
    this.userService.logIn(this.loginForm.value)
      .then(() => {
        this.router.navigate(['/']); // Navegar a la página principal después de un login exitoso
        this.loginError = false;  // Resetear el error si el login es exitoso
      })
      .catch(error => {
        this.loginError = true;
        console.log('Error de login', error);  // Para debugging
      });
  }
  
  stateLoginForm() {
    this.showLoginForm = true; // Muestra el formulario de login
  }

  goToSignUp() {
    this.router.navigate(['/signUp']);  // Navegar al formulario de SignUp
  }

  logOut() {
    this.userService.logOut();  // Llamar al servicio de logout
  }

  isLog(): boolean {
    // Si hay un token en las cookies, el usuario está logueado
    return !!this.userService.getCookie();
  }

  
}
