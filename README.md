# DeadDraw

Instrucciones para ejecutar el juego de cartas "DeadDraw" en tu máquina local.

---

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

| Herramienta | Versión recomendada |
|---|---|
| [Node.js](https://nodejs.org/) | 18 o superior |
| [MySQL](https://dev.mysql.com/downloads/) | 8.0 o superior |
| npm | incluido con Node.js |

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Psedanom/Videojuego.git
cd Videojuego
```

### 2. Instalar dependencias

```bash
cd Codigo/Videojuego
npm install
```

Esto instala todas las dependencias listadas en `package.json` (Express, CORS, MySQL2, entre otras).

### 3. Configurar la base de datos

1. Asegúrate de que MySQL esté en ejecución en tu máquina.
2. Abre `Codigo/Videojuego/app.js` y cambia el valor de `dbpassword` con la contraseña de tu usuario `root` de MySQL:

```js
const dbpassword = "tu_contraseña_aqui";
```

> La base de datos debe llamarse `DeadDraw` y el host por defecto es `127.0.0.1` con usuario `root`. Puedes modificar estos valores en la función `conectar()` dentro de `app.js`.

### 4. Crear las tablas y cargar los datos

Ejecuta el script SQL completo usando MySQL Workbench o cualquier cliente compatible:

```
Codigo/Bases_de_datos/creacion_completa.sql
```

Este script crea las tablas, triggers, stored procedures, vistas y datos de prueba (dummy data).

---

## Ejecutar el juego

### 1. Iniciar el servidor

Desde el directorio `Codigo/Videojuego`, ejecuta:

```bash
node app.js
```

El servidor quedará escuchando en `http://localhost:3000`.

> **Importante:** el servidor debe permanecer activo mientras juegas, ya que el juego se conecta continuamente a la API para funcionar.

### 2. Abrir el juego en el navegador

Desde el directorio `Codigo/Web/Menu`, abre el archivo de inicio de sesión:

**Windows:**
```cmd
start inicioSesion_registro.html
```

**Linux / macOS:**
```bash
xdg-open inicioSesion_registro.html   # Linux
```
```bash
open inicioSesion_registro.html       # macOS
```

### 3. Registrarse e iniciar sesión

Sigue las instrucciones en pantalla para crear una cuenta o iniciar sesión y comenzar a jugar.


---

## Solución de problemas

- **Error de conexión a la base de datos:** verifica que MySQL esté corriendo y que `dbpassword` en `app.js` sea correcto.
- **Puerto 3000 ocupado:** cierra cualquier otro proceso que use ese puerto o cambia el valor de `port` en `app.js`.
- **El juego no carga datos:** asegúrate de haber ejecutado `creacion_completa.sql` antes de iniciar el servidor.
