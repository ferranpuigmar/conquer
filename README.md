#### Stack tecnológico de la aplicación

- Javascript ES6
- SASS
- MongoDB
- Node.js con Express
- Webpack
- MongoAtlas como servidor cloud

#### Pasos a seguir para el correcto funcionamiento del repositorio

1. Descargar el repositorio en local

2. Abrir la carpeta en Visual Studio Code

3. Crear archivo ".env" y dentro del mismo poner lo siguiente:
   PORT=3000
   MONGODB_URI=mongodb+srv://admin:esfuture@cluster0.njbl5.mongodb.net/conquer
   API_URL=http://localhost:3000/api
4. Hacer npm install en la terminal

5. Según si el usuario dispone de macOS o Windows debe utilizar un comando u otro para correr el proyecto, dichos comandos los detallamos a continuacióm:
   a. MacOS: debe introducir "npm run dev_m" en la terminal
   b. Windows: debe introducir "npm run dev_w" en la terminal

6. La prueba de diferentes usuarios debe ser en diferentes navegadores

### Estructura del proyecto

- #### /config
  - configuración de axios a partir del apiClient
  - configuración conexión con MonbgoDB
- #### /constants
  - carpeta dónde colocar constantes de la aplicación
- #### /helpers
  - carpeta dónde se colocan algunas utilidades de ayuda como la gestión de retorno de error o la configuración de helpers de handleBars
- #### /models
  - modelos de mongoDB
- #### /public
  - /css: carpeta dónde se genera el css en el build
  - /img: carpeta para imágenes
  - bundle.js: archivo final que compila webpack con todo el js de la aplicación
- #### /routes
  - api.js: rutas de express para usar la apiRest de conquer
  - index.js: rutas para gestionar las distintas url (páginas) del proyecto
- #### /seeds
  - creación de datos iniciales en la BD al levantar el servidor
- #### /services
  - Servicios que usa la app para comunicarse con la api
    - games.js
    - ranking.js
    - rooms.js
    - user.js
- #### /sockets
  - scripts relacionados con sockets.io
- #### /src
  - carpeta que contiene los archivos que se compilan posteriormente para obtener el build final
    - js: archivos javascript
    - sass: archivos .scss
    - views: archivos de handlebars que componen las plantillas de las vistas de la aplicación

**package.json**

**server.js**: contiene la configuración de la aplicación de express

**postcss.config.js**: archivo que configura las preferencias de compilación del css resultante

**webpack.config.js**: configuración de webpack

## Documentación API Rest

Hemos usado swagger para generar la documentación de la API mediante comentarios.

Una vez levantado el proyecto poner la url http://localhost:3000/doc
