Configurar PostgreSQL para Betel Reus
=====================================

Estado actual
-------------
- El proyecto ya tiene endpoints preparados para PostgreSQL.
- Si existe `DATABASE_URL`, `server.mjs` usa PostgreSQL.
- Si no existe `DATABASE_URL`, usa memoria temporal de demo.
- El frontend ya llama a la API para:
  - Leer libros.
  - Crear pedidos desde el carrito.
  - Gestionar libros desde el panel admin.
  - Ver pedidos activos en admin.
  - Guardar historial/auditoria.


1. Crear la base de datos
-------------------------
Opcion recomendada en Render:
- En Render, crea un servicio nuevo de tipo PostgreSQL.
- Copia el valor de "External Database URL" o "Internal Database URL".
- Para la app web en Render, normalmente conviene usar la "Internal Database URL" si la web y la DB estan en Render.


2. Crear tablas
---------------
Abre PostgreSQL con pgAdmin4 o el Query Editor que uses y ejecuta:

`db/schema.sql`

Ese archivo crea:
- `books`
- `orders`
- `order_items`
- `audit_logs`

Tambien inserta libros demo iniciales si la tabla esta vacia.


3. Variables de entorno en Render
---------------------------------
En tu servicio web de Render, anade:

```env
DATABASE_URL=postgresql://usuario:password@host:5432/database
ADMIN_CODE=ADMIN-BETEL
DATABASE_SSL=true
```

Notas:
- Puedes cambiar `ADMIN_CODE` por otro codigo privado.
- Si tu PostgreSQL no requiere SSL, usa `DATABASE_SSL=false`.
- En Render Postgres normalmente deja `DATABASE_SSL=true` o no pongas la variable.


4. Configuracion del servicio web en Render
-------------------------------------------
Build command:

```bash
npm install
```

Start command:

```bash
node server.mjs
```

El servidor ya usa `process.env.PORT`, asi que Render puede asignar el puerto automaticamente.


5. Como comprobar que funciona
------------------------------
Cuando redeploye Render, abre:

```text
https://TU-APP.onrender.com/api/books
```

Si ves:

```json
{"source":"postgres", ...}
```

la base de datos ya esta conectada.

Si ves:

```json
{"source":"memory", ...}
```

la app no esta leyendo `DATABASE_URL`.


6. Flujo esperado
-----------------
- Un miembro entra en `/library.html`.
- Introduce nombre y codigo.
- Anade libros al carrito.
- Confirma pedido.
- El pedido se guarda en PostgreSQL.
- El admin entra en `/admin.html`.
- El admin ve el pedido aunque este en otro navegador/dispositivo.
- El admin marca el pedido como preparado, entregado o cancelado.
- Si marca entregado, se descuenta stock en PostgreSQL.
- El historial se guarda en `audit_logs`.


7. Pendiente antes de produccion
--------------------------------
- Sustituir codigo de admin por login real.
- Decidir si el codigo de biblioteca sigue existiendo o se reemplaza por usuarios.
- Anadir validaciones mas finas de stock y datos personales.
- Preparar politica de privacidad.
- Cambiar contrasenas/codigos antes de ensenar el panel a mas personas.
