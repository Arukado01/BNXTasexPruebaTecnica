import { enableProdMode, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules
} from '@angular/router';

import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi
} from '@angular/common/http';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { AuthService } from './app/services/auth.service';

import { environment } from './environments/environment';

import {
  provideFirebaseApp,
  initializeApp
} from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';

if (environment.production) {
  enableProdMode();
}

/** Hook para inicializar AuthService ANTES de arrancar la app */
function initAuth(authSvc: AuthService) {
  return () => authSvc.init();
}

bootstrapApplication(AppComponent, {
  providers: [
    // Routing de Ionic
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),

    // HTTP Client: toma los interceptores registrados en DI (HTTP_INTERCEPTORS)
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),

    // Rutas con precarga
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),

    // Registrar tu interceptor clásico en el token HTTP_INTERCEPTORS
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    // App initializer para el login simulado
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [AuthService],
      multi: true
    },

    // Módulos extra opcionales (FormsModule, IonicModule.forRoot(), etc.)
    importProvidersFrom(
      // FormsModule,
      // IonicModule.forRoot(),
    )
  ]
})
  .catch(err => console.error(err));
