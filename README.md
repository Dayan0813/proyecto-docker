# Marketplace — Despliegue con Docker (sin Docker Compose)

Guía paso a paso para levantar frontend, backend y MySQL en contenedores Docker conectados mediante redes manuales.

---

## Arquitectura de redes

```
[Frontend] ──── red: frontend-backend ──── [Backend] ──── red: backend-db ──── [MySQL]
```

- `frontend-backend`: conecta Nginx/React con el backend.
- `backend-db`: conecta el backend con MySQL.
- El frontend **no tiene acceso directo** a la base de datos.

---

## Paso 1 — Crear las redes

```bash
docker network create frontend-backend
docker network create backend-db
```

---

## Paso 2 — Crear el volumen para la base de datos

```bash
docker volume create db_data
```

---

## Paso 3 — Levantar MySQL

```bash
docker run -d \
  --name sql-data \
  --network backend-db \
  --restart unless-stopped \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=marketplace \
  -v db_data:/var/lib/mysql \
  mysql:8.0
```

Espera unos segundos a que MySQL termine de inicializar. Puedes verificarlo con:

```bash
docker logs -f sql-data
```

Cuando veas `ready for connections` en el log, continúa al siguiente paso.

Opcionalmente, si quieres cargar el dump inicial:

```bash
docker exec -i sql-data mysql -uroot -proot marketplace < Marketplace.sql
```

---

## Paso 4 — Construir la imagen del backend

Desde la raíz del proyecto:

```bash
docker build -t marketplace-backend ./Backend_MarckePlace
```

---

## Paso 5 — Levantar el backend

```bash
docker run -d \
  --name backend \
  --network backend-db \
  --restart unless-stopped \
  -e PORT=3000 \
  -e JWT_SECRET=replace_with_a_secret \
  -e DB_TYPE=mysql \
  -e DB_HOST=sql-data \
  -e DB_PORT=3306 \
  -e DB_USER=root \
  -e DB_PASSWORD=root \
  -e DB_NAME=marketplace \
  marketplace-backend
```

Luego conéctalo también a la red del frontend:

```bash
docker network connect frontend-backend backend
```

> El backend necesita estar en **ambas redes**: `backend-db` para hablar con MySQL y `frontend-backend` para recibir peticiones del frontend.

---

## Paso 6 — Construir la imagen del frontend

```bash
docker build -t marketplace-frontend ./frontend
```

---

## Paso 7 — Levantar el frontend

```bash
docker run -d \
  --name frontend \
  --network frontend-backend \
  --restart unless-stopped \
  -p 5173:5173 \
  marketplace-frontend
```

---

## Paso 8 — Verificar que todo corre

```bash
docker ps
```

Deberías ver los tres contenedores con estado `Up`.

```bash
# Logs de cada servicio
docker logs -f backend
docker logs -f frontend
docker logs -f sql-data
```

---

## Acceder a la aplicación

| Servicio | URL                    |
|----------|------------------------|
| Frontend | http://localhost:5173  |
| Backend  | interno (no expuesto)  |
| MySQL    | interno (no expuesto)  |

El frontend hace proxy de `/api/*` hacia `http://backend:3000` a través de la configuración en `nginx.conf`.

---

## Gestión del volumen

```bash
# Ver volúmenes
docker volume ls

# Inspeccionar
docker volume inspect db_data

# Eliminar (borra todos los datos de la BD)
docker volume rm db_data
```

---

## Comandos útiles

```bash
# Detener un contenedor
docker stop frontend backend sql-data

# Iniciar contenedores detenidos
docker start sql-data backend frontend

# Eliminar contenedores
docker rm frontend backend sql-data

# Eliminar imágenes
docker rmi marketplace-frontend marketplace-backend

# Shell dentro de un contenedor
docker exec -it backend sh

# Conectarse a MySQL
docker exec -it sql-data mysql -uroot -proot marketplace

# Ver redes y sus contenedores conectados
docker network inspect frontend-backend
docker network inspect backend-db
```

---

## Limpiar todo

```bash
docker stop frontend backend sql-data
docker rm frontend backend sql-data
docker rmi marketplace-frontend marketplace-backend
docker network rm frontend-backend backend-db
docker volume rm db_data
```

---

## Solución de problemas comunes

**El backend no conecta con MySQL al arrancar**  
MySQL tarda unos segundos en estar listo. Reinicia el backend una vez que la BD esté lista:
```bash
docker restart backend
```

**Cambios en el código no se reflejan**  
Reconstruye la imagen y recrea el contenedor:
```bash
docker stop backend && docker rm backend
docker build -t marketplace-backend ./Backend_MarckePlace
# luego ejecuta de nuevo el paso 5
```

**Puerto 5173 ocupado**  
Cambia el mapeo de puertos en el paso 7:
```bash
-p 8080:5173   # accede desde http://localhost:8080
