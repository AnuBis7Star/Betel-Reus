Configurar PostgreSQL para Betel Reus
=====================================

Estado actual
-------------
- El proyecto ya tiene endpoints preparados para PostgreSQL.
- Si existe `DATABASE_URL`, `server.mjs` usa PostgreSQL.
- Si no existe `DATABASE_URL`, usa memoria temporal de demo.
- Ese modo en memoria es solo un fallback local de desarrollo para poder probar la app sin PostgreSQL.
- El frontend ya llama a la API para:
  - Leer libros.
  - Crear pedidos desde el carrito.
  - Gestionar libros desde el panel admin.
  - Ver pedidos activos en admin.
  - Guardar historial/auditoria.


1. Crear la base de datos
-------------------------
Opcion recomendada:
- Crea PostgreSQL en el proveedor que uses actualmente.
- Copia la cadena `DATABASE_URL` que te entregue ese proveedor.
- Si la web esta alojada en Hostinger y la base de datos vive en otro servicio, usa la URL externa que te entregue el proveedor de PostgreSQL.
- Guarda la conexion como variable de entorno y no en archivos frontend.


2. Crear tablas
---------------
Abre PostgreSQL con pgAdmin4 o el Query Editor que uses y ejecuta:

`backend/src/db/schema.sql`

Ese archivo crea:
- `books`
- `orders`
- `order_items`
- `audit_logs`

Tambien inserta libros demo iniciales si la tabla esta vacia.


3. Variables de entorno en hosting
----------------------------------
En tu hosting actual, anade:

```env
DATABASE_URL=postgresql://usuario:password@host:5432/database
ADMIN_CODE=un-codigo-largo-y-privado
DATABASE_SSL=true
```

Notas:
- Puedes cambiar `ADMIN_CODE` por otro codigo privado.
- Si tu PostgreSQL no requiere SSL, usa `DATABASE_SSL=false`.
- Si tu proveedor exige SSL, deja `DATABASE_SSL=true` o no pongas la variable.


4. Configuracion del servicio web
--------------------------------
Install command:

```bash
npm install
```

Start command:

```bash
node server.mjs
```

El servidor ya usa `process.env.PORT`, asi que el proveedor puede asignar el puerto automaticamente.


5. Como comprobar que funciona
------------------------------
Cuando despliegues o reinicies la app, abre:

```text
https://betelreus.com/api/books
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

la app no esta leyendo `DATABASE_URL` y esta funcionando en fallback local de desarrollo.


6. Flujo esperado
-----------------
- Un miembro entra en `/library.html`.
- Introduce nombre y codigo.
- Anade libros al carrito.
- Confirma pedido.
- El pedido se guarda en PostgreSQL.
- El admin entra en `/admin.html`.
- El admin ve el pedido aunque este en otro navegador/dispositivo.
- El admin marca el pedido como completado o cancelado.
- Si marca completado, se descuenta stock en PostgreSQL.
- El historial se guarda en `audit_logs`.


7. Pendiente antes de produccion
--------------------------------
- Sustituir codigo de admin por login real.
- Decidir si el codigo de biblioteca sigue existiendo o se reemplaza por usuarios.
- Revisar y endurecer validaciones de stock y datos personales a medida que crezca el uso real.
- Preparar politica de privacidad.
- Cambiar contrasenas/codigos antes de ensenar el panel a mas personas.
