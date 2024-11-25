import { Component, OnInit } from "@angular/core";
import { FormGroup,FormControl, Validators } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;  // Formulario reactivo para email y password

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // Inicializamos el formulario con los campos email, password, userName y subscription
    this.signUpForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      userName: new FormControl('', [Validators.required]),
      subscription: new FormControl(false),
    });
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      return;  // Si el formulario es inválido, no hacemos nada
    }

    // Enviar los datos del formulario al servicio para registrar al usuario
    this.userService.register(this.signUpForm.value)
      .then((response) => {
        if (response && response.user) {
          const user = response.user;
          console.log('Usuario registrado:', user.uid);

          // Redirigir a la página principal o dashboard
          this.router.navigate(['/']);
        }
      })
      .catch((error) => {
        console.log('Error al registrar al usuario', error);
      });
  }
  
}
