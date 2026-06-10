# Preparación Profesional Para Producción

Este documento resume la configuración recomendada para la instalación actual en hosting de pago y dominio propio.

## Arquitectura

- `frontend/public` contiene la web estática.
- `backend/src` contiene API, MVC, PostgreSQL, seguridad básica y servidor.
- El navegador solo se comunica con PostgreSQL a través de `/api/*`.
- La raíz conserva `npm run dev` y `npm start` para desarrollo local y ejecución directa en Node.

## Variables De Entorno

Configurar en el proveedor de hosting:

```env
DATABASE_URL=postgresql://...
DATABASE_SSL=true
ADMIN_CODE=un-codigo-largo-y-privado
CORS_ORIGIN=https://betelreus.com,https://www.betelreus.com
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=240
ORDER_RATE_LIMIT_MAX=12
ADMIN_RATE_LIMIT_MAX=120
MAX_JSON_BODY_BYTES=102400
```

En hosting real, configura siempre `ADMIN_CODE` explícitamente y no dependas del fallback local de desarrollo.

## Dominio Y HTTPS

- Comprar dominio final.
- Configurar DNS hacia el proveedor de hosting.
- Activar HTTPS gestionado por el proveedor.
- Elegir dominio canónico: con `www` o sin `www`.
- Redirigir la variante secundaria a la principal.

## Seguridad

Ya implementado:

- Consultas PostgreSQL parametrizadas.
- API como única capa de acceso a base de datos.
- Headers básicos de seguridad.
- CORS controlado por `CORS_ORIGIN`.
- Rate limit por IP para API, pedidos y admin.
- Límite de tamaño para JSON.
- Validación inicial de payloads.
- Escapado de contenido dinámico renderizado en frontend.

Pendiente recomendado:

- Login real para admin y miembros.
- Sesiones seguras con cookies `HttpOnly`, `Secure`, `SameSite`.
- Hash de contraseñas con Argon2 o bcrypt.
- Roles: admin, biblioteca, miembro.
- CSRF si se usan cookies para acciones autenticadas.
- Backups automáticos de PostgreSQL.
- Política de privacidad y retención de datos.
- Monitorización de errores y logs.

## Hosting Actual

La web está alojada en Hostinger con plan de pago y dominio de pago.

Mantén esta documentación centrada en la instalación actual salvo que se planifique una migración real.

Para esta app, lo más simple es mantener Node sirviendo frontend y API desde el mismo dominio:

```text
https://betelreus.com/
https://betelreus.com/api/books
```

Más adelante se puede separar:

```text
frontend: https://betelreus.com
backend:  https://api.betelreus.com
```

Cuando se haga esa separación, `CORS_ORIGIN` deberá incluir el dominio del frontend.
