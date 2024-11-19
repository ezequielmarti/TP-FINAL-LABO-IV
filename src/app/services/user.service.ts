import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { signOut, UserCredential } from 'firebase/auth';
import { getDatabase, set, ref, get } from 'firebase/database';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private auth: Auth, private cookies: CookieService) { }

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

  logIn({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(response => {
        if (response && response.user) {
          response.user.getIdToken().then(token => {
            this.cookies.set('token', token); // Guardar token en cookies
          });
        }
      })
      .catch(error => {
        console.log('Error de login', error);
        throw true; // Lanzar el error para manejarlo en el componente
      });
  }

  getCookie() {
    return this.cookies.get('token');  // Obtener el token desde las cookies
  }

  logOut() {
    signOut(this.auth)
      .then(() => {
        this.cookies.delete('token'); // Eliminar token de las cookies
      })
      .catch(error => {
        console.log('Error al cerrar sesión', error);
      });
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
