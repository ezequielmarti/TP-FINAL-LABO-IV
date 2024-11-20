import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential} from '@angular/fire/auth';
import { CookieService } from 'ngx-cookie-service';
import { getDatabase, ref, get, set } from 'firebase/database';
import { User} from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);  // Estado de login
  private userNameSubject = new BehaviorSubject<string>('');

  constructor(private auth: Auth, private cookies: CookieService) {
    // Comprobar si el token está presente para verificar el estado de autenticación
    const token = this.cookies.get('token');
    if (token) {
      this.loggedInSubject.next(true);  // El usuario está logueado
      this.auth.onAuthStateChanged(user => {
        if (user) {
          this.userNameSubject.next(user.displayName || '');  // Establecer nombre de usuario
        }
      });
    }
  }

  register({ email, password, userName, subscription }: any): Promise<UserCredential | undefined> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((response) => {
        if (response && response.user) {
          const newUser: User = new User(userName,email,response.user.uid,subscription);
          set(ref(getDatabase(), 'users/' + response.user.uid), newUser)
            .then(() => {
              console.log('Usuario guardado en la base de datos');
            })
            .catch((error) => {
              console.error('Error al guardar usuario en Realtime Database:', error);
            });
          return response;
        }else{
          return undefined;
        }
      })
      .catch((error) => {
        console.error('Error al registrar al usuario', error);
        return undefined;
      });
  }

  // Método para loguear al usuario
  logIn({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((response) => {
        if (response && response.user) {
          response.user.getIdToken().then((token) => {
            this.cookies.set('token', token); // Guardar el token en las cookies
            this.loggedInSubject.next(true);  // Cambiar el estado de login a verdadero
            this.userNameSubject.next(response.user.displayName || ''); // Establecer el nombre de usuario
          });
        }
      })
      .catch((error) => {
        console.log('Error de login', error);
        throw true; // Lanzamos el error para manejarlo en el componente
      });
  }

  // Método para obtener el estado de login
  getLoginStatus() {
    return this.loggedInSubject.asObservable();  // Permite a los componentes suscribirse al estado de login
  }

  // Obtener el token guardado en las cookies
  getCookie() {
    return this.cookies.get('token');
  }

  // Método para cerrar sesión
  logOut() {
    signOut(this.auth)
      .then(() => {
        this.cookies.delete('token'); // Eliminar token de las cookies
        this.loggedInSubject.next(false);  // Cambiar el estado de login a falso
        this.userNameSubject.next('');  // Limpiar el nombre de usuario
      })
      .catch((error) => {
        console.log('Error al cerrar sesión', error);
      });
  }

  // Verificar si el usuario está logueado
  isLoggedIn(): boolean {
    return this.loggedInSubject.getValue();
  }

  getUserData(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      // Espera a que Firebase restaure el estado de autenticación
      this.auth.onAuthStateChanged(user => {
        if (!user) {
          resolve(null);  // Si no hay usuario autenticado, retorna null
          return;
        }
  
        // Si el usuario está autenticado, obtenemos sus datos
        const db = getDatabase();
        const userRef = ref(db, 'users/' + user.uid);
  
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              
              // Crear el objeto User con los datos obtenidos de la base de datos
              const userObj = new User(
                userData.userName,
                userData.email,
                userData.key,
                userData.subscription
              );
              
              userObj.likes = userData.likes || [];
              userObj.active = userData.active;
  
              resolve(userObj);  // Retorna el objeto User
            } else {
              resolve(null);  // Si no existe el usuario, retorna null
            }
          })
          .catch((error) => {
            console.error('Error al obtener los datos del usuario', error);
            resolve(null);  // En caso de error, retorna null
          });
      });
    });
  }
}
