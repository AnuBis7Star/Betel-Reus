# Despliegue En Hostinger

Esta web no debe desplegarse como una pagina estatica normal dentro de `public_html`.

El proyecto necesita ejecutar Node.js porque:

- Sirve la web desde `frontend/public`.
- Expone la API en `/api/*`.
- Conecta con PostgreSQL mediante `DATABASE_URL`.
- Gestiona biblioteca, pedidos, auditoria y registros del torneo.
- Protege las rutas admin con `ADMIN_CODE`.

Si solo se sube `index.html` a `public_html`, la portada puede cargar, pero dejaran de funcionar la API, la biblioteca, el panel admin y cualquier dato dinamico.

## Por Que Sale 403

Un `403 Forbidden` en Hostinger con `server: LiteSpeed` suele significar que el dominio esta apuntando a una carpeta web que no tiene un `index.html` valido, que `public_html` esta vacio, o que el `.htaccess` no esta redirigiendo al proceso Node.

En este proyecto, si Hostinger esta usando hosting estatico clasico, buscara:

```text
public_html/index.html
```

Pero nuestro `index.html` esta aqui:

```text
frontend/public/index.html
```

Eso es correcto para nuestra arquitectura, siempre que Hostinger ejecute el servidor Node.

## Configuracion Correcta En Hostinger

Usar el producto de Hostinger para **Node.js Web App**. En la configuracion del despliegue desde GitHub:

```text
Framework / Type: Other
Root directory: .
Install command: npm install
Build command: dejar vacio si Hostinger lo permite
Start command: npm start
Entry file: server.mjs
Node version: 20.x o 22.x
```

El comando `npm start` ejecuta:

```text
node backend/src/server.mjs
```

El servidor Node ya usa:

```text
process.env.PORT || 3000
```

Por lo tanto Hostinger puede asignar su propio puerto.

## public_html

En una app Node de Hostinger, no hace falta copiar manualmente `frontend/public/index.html` a `public_html`.

Hostinger debe crear o regenerar automaticamente un archivo:

```text
public_html/.htaccess
```

Ese archivo debe enrutar el trafico hacia la app Node desplegada fuera de `public_html`, normalmente en una carpeta interna tipo `nodejs`.

Si sigue apareciendo `403`:

1. En hPanel, entra en la app Node de `betelreus.com`.
2. Haz **Redeploy**.
3. Revisa que exista `public_html/.htaccess`.
4. Si `public_html` esta vacio y no hay `.htaccess`, la app no esta conectada como Node.js Web App.
5. Revisa los logs de despliegue y arranque de Hostinger.

## Variables De Entorno

Configurar estas variables en Hostinger, dentro de la app Node:

```env
DATABASE_URL=postgresql://usuario:password@host:puerto/database
DATABASE_SSL=true
ADMIN_CODE=un-codigo-largo-y-privado
CORS_ORIGIN=https://betelreus.com,https://www.betelreus.com
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=240
ORDER_RATE_LIMIT_MAX=12
ADMIN_RATE_LIMIT_MAX=120
VOLLEY_RATE_LIMIT_MAX=6
MAX_JSON_BODY_BYTES=102400
```

Importante:

- `DATABASE_URL` debe ser la URL externa de PostgreSQL.
- Si sigues usando la base de datos de Render, puedes reutilizar la External Database URL de Render.
- Si creas una base en otro proveedor, cambia `DATABASE_URL` por la nueva.
- No poner estas variables dentro de archivos publicos del frontend.

## Comprobar Que La Base De Datos Esta Conectada

Despues del despliegue, abre:

```text
https://betelreus.com/api/books
```

Si responde con:

```json
{
  "source": "postgres",
  "books": []
}
```

la web esta conectada a PostgreSQL.

Si responde con:

```json
{
  "source": "memory",
  "books": []
}
```

la app Node esta funcionando, pero Hostinger no esta leyendo `DATABASE_URL`.

Si devuelve `404`, `403` o HTML de error, la peticion no esta llegando a la app Node.

## Checklist Rapido

- El dominio `betelreus.com` esta creado como Node.js Web App, no solo Web Hosting estatico.
- GitHub esta conectado al repo correcto y a la rama `main`.
- Hostinger ejecuta `npm install`.
- Hostinger arranca con `npm start` o `server.mjs`.
- `ADMIN_CODE` esta configurado.
- `DATABASE_URL` esta configurado.
- `DATABASE_SSL=true` esta configurado si la base externa requiere SSL.
- `CORS_ORIGIN` incluye `https://betelreus.com` y `https://www.betelreus.com`.
- `https://betelreus.com/api/books` devuelve JSON.
- `https://betelreus.com/admin.html` carga el panel.

## Alternativa Si Tu Plan No Soporta Node.js

Si tu plan de Hostinger solo permite archivos estaticos en `public_html`, no podemos alojar esta app completa ahi sin cambiar la arquitectura.

Opciones:

1. Mantener backend en Render/Railway/Fly.io y usar Hostinger solo para frontend estatico.
2. Usar Hostinger VPS y configurar Node.js manualmente con Nginx o similar.
3. Cambiar a un plan Hostinger con Node.js Web Apps.

La opcion recomendada para este proyecto es mantener frontend y backend juntos bajo el mismo dominio con Node.js:

```text
https://betelreus.com/
https://betelreus.com/api/books
```
