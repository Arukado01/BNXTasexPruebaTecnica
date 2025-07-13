# ERP360 SPA - Evaluación Técnica Simplificada para ERP BNS

 **SPA 360 SUCCESS**: Aplicación web de gestión de empresas con roles y permisos, desarrollada con **Ionic 7.2 + Angular Standalone** en el frontend y **Firebase Cloud Functions** (Node.js) en el backend.

 Si desea observar este proyecto corriendo en productivo por favor sigue el siguiente enlace: [https://reto-erp360.web.app/](https://reto-erp360.web.app/)

Se adjunta el archivo de la colección de postman con los endpoints del servicio web. 
Si desea usted probar el servicio web que se encuentra actualmente en productivo cambiar las siguientes variables en la solicitud:
   ```
   {{baseUrl}}: https://seedadmin-ynyxaoohla-uc.a.run.app
   {{baseUrlApi}}: https://api-ynyxaoohla-uc.a.run.app
   ```

---

## 📋 Requisitos previos

Antes de comenzar, asegúrate de tener instaladas estas herramientas en tu entorno de desarrollo:

1. **Node.js** (v22 LTS)
2. **npm** (v10+) o **yarn**
3. **Ionic CLI**
   ```bash
   npm install -g @ionic/cli
   ```
4. **Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```
5. Cuenta activa de **Firebase** con proyecto creado en el cual esté habilitada la autenticación por Correo electrónico/contraseña.

---

## 🔧 Configuración del backend (Cloud Functions)

Todas las funciones están en la carpeta `functions/`.

1. **Instala dependencias**
   ```bash
   cd functions
   npm install
   ```

2. **Configura variables de entorno**

   a. Obtén tu **API Key** de Firebase:
   - Entra a [Firebase Console](https://console.firebase.google.com/) y selecciona tu proyecto.
   - Haz clic en el icono de engranaje (⚙️) junto a **Configuración del proyecto**.
   - En la sección **Tus apps**, registra una **app web** si aún no lo has hecho.
   - Copia el valor de **Clave API** (`apiKey`) que aparece en la configuración de la App.

   b. Crea un archivo `.env` en la carpeta `functions/` con los siguientes datos:
   ```ini
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=Admin123!
   FIREBASE_APIKEY=<API_KEY_FIREBASE>
   ```

3. **Despliega las Functions**
   ```bash
   firebase deploy --only functions
   ```

4. **Estructura principal de endpoints**

A continuación se detallan cada uno de los endpoints de la API, con método HTTP, URL, cabeceras, parámetros de entrada y ejemplos de respuesta.

*(Aquí sigue la descripción de los endpoints existente...)*

### 4.1 `GET /auth/seed-admin`

- **Descripción**: Endpoint idempotente para crear o actualizar el usuario administrador predefinido.
- **Method**: GET
- **URL**: `/auth/seed-admin`
- **Headers**: No requiere autenticación.
- **Request Body**: N/A
- **Respuesta Exitosa (200)**:
  ```json
  {
    "ok": true,
    "uid": "abcd1234..."
  }
  ```
- **Error (500)**:
  ```json
  {
    "ok": false,
    "error": "Mensaje de error"
  }
  ```

### 4.2 `POST /auth/login`

- **Descripción**: Autentica con Firebase Auth y devuelve tokens para el usuario (admin por defecto o credenciales en body).
- **Method**: POST
- **URL**: `/auth/login`
- **Headers**:
  - `Content-Type: application/json`
- **Request Body** (opcional):
  ```json
  {
    "email": "admin@example.com",  
    "password": "Admin123!"  
  }
  ```
  Si se omite, usa las credenciales en `.env`.
- **Respuesta Exitosa (200)**:
  ```json
  {
    "idToken": "<JWT_ID_TOKEN>",
    "refreshToken": "<REFRESH_TOKEN>",
    "expiresIn": "3600",
    "uid": "abcd1234..."
  }
  ```
- **Error (400)**:
  ```json
  {
    "error": "EMAIL_NOT_FOUND"
  }
  ```

### 4.3 `GET /auth/is-admin`

- **Descripción**: Verifica que el token en cabecera pertenezca a un usuario con rol `admin`.
- **Method**: GET
- **URL**: `/auth/is-admin`
- **Headers**:
  - `Authorization: Bearer <idToken>`
- **Request Body**: N/A
- **Respuesta Exitosa (200)**:
  ```json
  {
    "ok": true
  }
  ```
- **Error (401 / 403)**:
  ```json
  { "error": "Sin permiso" }
  ```

### 4.4 `POST /companies`

- **Descripción**: Crea una nueva empresa y un usuario administrador asociado.
- **Method**: POST
- **URL**: `/companies`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <idToken>`
- **Request Body**:
  ```json
  {
    "name": "Nombre Empresa",
    "nit": "123456789",
    "emailAdmin": "user@empresa.com",
    "password": "SecretPass!"
  }
  ```
- **Respuesta Exitosa (201)**:
  ```json
  {
    "id": "efgh5678..."
  }
  ```
- **Error (400)**:
  ```json
  {
    "error": "Faltan datos"
  }
  ```
- **Error (401 / 403)**:
  ```json
  { "error": "Sin permiso" }
  ```

### 4.5 `GET /companies`

- **Descripción**: Obtiene el listado de empresas existentes, ordenadas por fecha de creación descendente.
- **Method**: GET
- **URL**: `/companies`
- **Headers**:
  - `Authorization: Bearer <idToken>`
- **Request Body**: N/A
- **Respuesta Exitosa (200)**:
  ```json
  [
    {
      "id": "efgh5678...",
      "name": "Nombre Empresa",
      "nit": "123456789",
      "ownerUID": "abcd1234...",
      "createdAt": { "_seconds": 1627684800, "_nanoseconds": 0 }
    }
    // ...
  ]
  ```
- **Error (401 / 403)**:
  ```json
  { "error": "Sin permiso" }
  ```

5. **Seed del usuario admin**   **Seed del usuario admin** (solo la primera vez)
   ```bash
   curl https://us-central1-<tu-proyecto>.cloudfunctions.net/seedAdmin
   ```
   Esto crea en Firebase Auth al usuario con email/password definidos y en Firestore un documento `users/{uid}` con `roles: ['admin']`.

---

## ⚙️ Configuración del frontend (Ionic + Angular)

La aplicación cliente vive en `erp360/`.

1. **Instala dependencias**
   ```bash
   cd erp360
   npm install
   ```

2. **Variables de entorno**

   1. **Obtén tu configuración de Firebase**  
      - Entra a la Firebase Console y selecciona tu proyecto.  
      - Haz clic en el icono de engranaje (⚙️) junto a "Project Overview" y selecciona "Configuración del proyecto".  
      - En la sección "Tus apps", registra una app web si aún no lo has hecho y luego copia el fragmento de configuración:
      ```ts
      const firebaseConfig = {
        apiKey: "<API_KEY>",
        authDomain: "<PROJECT_ID>.firebaseapp.com",
        projectId: "<PROJECT_ID>",
        storageBucket: "<PROJECT_ID>.appspot.com",
        messagingSenderId: "<SENDER_ID>",
        appId: "<APP_ID>",
        measurementId: "<MEASUREMENT_ID>"
      };
      ```
   2. **Configura `environment.ts`**  
      Edita `src/environments/environment.ts` y pega:
      ```ts
      export const environment = {
        production: false,
        firebase: firebaseConfig,
        api: 'https://us-central1-<tu-proyecto>.cloudfunctions.net/api'
      };
      ```
   3. **Configura `environment.prod.ts`**  
      Edita `src/environments/environment.prod.ts` y pega:
      ```ts
      export const environment = {
        production: true,
        firebase: firebaseConfig,
        api: 'https://us-central1-<tu-proyecto>.cloudfunctions.net/api'
      };
      ```

3. **Servir en desarrollo**
   ```bash
   ionic serve
   ```
   - Abre `http://localhost:8100`
   - La app realizará un *login automático* al arrancar (gracias a `AuthService.init()` en un `APP_INITIALIZER`).

4. **Uso de Ionic standalone + Angular**
   - **App initializer**: `AuthService.init()` via `APP_INITIALIZER` para login simulado de admin.
   - **Interceptor HTTP**: añade token en header `Authorization`.
   - **roleGuard('admin')**: protege rutas.
   - **CompanyService**: `list()` y `create()`.
   - **Páginas**:
     - `company-list.page.ts`: tabla con búsqueda, paginación, menú y modal.
     - `company-create.page.ts`: formulario reactivo, validaciones visuales, alerta Ionic y confetti.

---

## 🔐 Seguridad en Firestore

Archivo `firestore.rules`:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /companies/{companyId} {
      allow read, write: if request.auth != null
                         && 'admin' in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles;
    }
    match /users/{userId} {
      allow read: if request.auth != null
                  && 'admin' in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles;
    }
  }
}
```

- Documento `users/{uid}` guarda `roles: ['admin']`.
- Solo usuarios autenticados con rol **admin** pueden leer/escribir **companies**.

---

## 📝 Licencia

**Carlos Cortina** ©2025
