# VPS Hostinger Con OpenLiteSpeed

Este proyecto esta listo para funcionar en un VPS con OpenLiteSpeed usando Node.js detras de un reverse proxy.

Arquitectura recomendada:

```text
Visitante
  -> https://betelreus.com
  -> OpenLiteSpeed en puertos 80/443
  -> reverse proxy interno
  -> Node.js en 127.0.0.1:3000
  -> PostgreSQL mediante DATABASE_URL
```

No hay que copiar `frontend/public/index.html` a `public_html`. El servidor Node ya sirve `frontend/public` y tambien expone `/api/*`.

## Por Que Esta Arquitectura Encaja

La documentacion oficial de OpenLiteSpeed indica que Node.js normalmente corre como un servidor separado y que OpenLiteSpeed puede enviarle trafico mediante proxy.

OpenLiteSpeed tambien documenta el modo reverse proxy mediante una **External App** y reglas rewrite con `[P]`.

Para esta web, ese modo es mas robusto que intentar ejecutar Node directamente desde un contexto App Server, porque:

- Podemos controlar el proceso Node con `systemd`.
- Podemos guardar variables y secretos fuera del repositorio.
- Podemos reiniciar la app sin tocar OpenLiteSpeed.
- El dominio mantiene frontend y API bajo el mismo origen.

Fuentes:

- https://docs.openlitespeed.org/config/appserver/nodejs/
- https://docs.openlitespeed.org/config/reverseproxy/
- https://docs.openlitespeed.org/config/rewriterules/

## 1. Preparar DNS

En Hostinger, apunta el dominio al VPS:

```text
Tipo: A
Nombre: @
Valor: IP_DEL_VPS

Tipo: A
Nombre: www
Valor: IP_DEL_VPS
```

La propagacion puede tardar.

## 2. Instalar Dependencias En El VPS

Ejemplo para Ubuntu 22/24:

```bash
sudo apt update
sudo apt install -y git curl ca-certificates

curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

node -v
npm -v
```

OpenLiteSpeed puede instalarse desde una imagen de Hostinger Marketplace o siguiendo la documentacion oficial de OpenLiteSpeed.

## 3. Crear Usuario Para La App

```bash
sudo adduser --system --group --home /var/www/betel-reus betel
sudo mkdir -p /var/www/betel-reus
sudo chown -R betel:betel /var/www/betel-reus
```

## 4. Clonar El Proyecto

```bash
sudo -u betel git clone https://github.com/AnuBis7Star/Betel-Reus.git /var/www/betel-reus
cd /var/www/betel-reus
sudo -u betel npm ci
sudo -u betel npm run check
```

## 5. Configurar Variables De Entorno

```bash
sudo mkdir -p /etc/betel-reus
sudo cp /var/www/betel-reus/deploy/openlitespeed/betel-reus.env.example /etc/betel-reus/betel-reus.env
sudo nano /etc/betel-reus/betel-reus.env
```

Valores importantes:

```env
NODE_ENV=production
HOST=127.0.0.1
PORT=3000
DATABASE_URL=postgresql://...
DATABASE_SSL=true
ADMIN_CODE=...
CORS_ORIGIN=https://betelreus.com,https://www.betelreus.com
```

Si usas la base PostgreSQL que ya tenias en Render, puedes poner su External Database URL en `DATABASE_URL`.

Si instalas PostgreSQL dentro del VPS, cambia `DATABASE_URL` para apuntar a esa base local.

Protege el archivo:

```bash
sudo chown root:betel /etc/betel-reus/betel-reus.env
sudo chmod 640 /etc/betel-reus/betel-reus.env
```

## 6. Instalar Servicio systemd

```bash
sudo cp /var/www/betel-reus/deploy/openlitespeed/betel-reus.service /etc/systemd/system/betel-reus.service
sudo systemctl daemon-reload
sudo systemctl enable betel-reus
sudo systemctl start betel-reus
sudo systemctl status betel-reus
```

Ver logs:

```bash
journalctl -u betel-reus -f
```

Debe verse:

```text
Biserica Betel Reus running on http://127.0.0.1:3000
PostgreSQL connected via DATABASE_URL
```

Prueba local en el VPS:

```bash
curl -I http://127.0.0.1:3000
curl http://127.0.0.1:3000/api/books
```

## 7. Configurar OpenLiteSpeed Como Reverse Proxy

En WebAdmin:

```text
https://IP_DEL_VPS:7080
```

### Crear External App

Ruta aproximada:

```text
Virtual Hosts > betelreus.com > External App > Add
```

Valores:

```text
Type: Web Server
Name: betel_node
Address: 127.0.0.1:3000
Max Connections: 100
Initial Request Timeout: 60
Retry Timeout: 0
Response Buffering: No
```

### Activar Rewrite

Ruta:

```text
Virtual Hosts > betelreus.com > Rewrite
```

Valores:

```text
Enable Rewrite: Yes
Auto Load from .htaccess: No
```

Rewrite rules:

```apache
RewriteRule ^(.*)$ HTTP://betel_node/$1 [P,L,E=PROXY-HOST:betelreus.com]
```

Despues haz **Graceful Restart**.

## 8. SSL

Configura certificado SSL para:

```text
betelreus.com
www.betelreus.com
```

Puedes usar la opcion de SSL/ACME disponible en tu panel o configurar Let's Encrypt en el VPS.

Cuando SSL funcione, comprueba:

```bash
curl -I https://betelreus.com
curl https://betelreus.com/api/books
```

## 9. Comprobacion Final

Estas URLs deben funcionar:

```text
https://betelreus.com/
https://betelreus.com/library.html
https://betelreus.com/admin.html
https://betelreus.com/volley.html
https://betelreus.com/api/books
https://betelreus.com/api/verse
https://betelreus.com/api/youtube
```

`/api/books` debe devolver:

```json
{
  "source": "postgres",
  "books": []
}
```

Si devuelve `"source": "memory"`, Node funciona pero `DATABASE_URL` no esta configurado correctamente.

## 10. Actualizar La Web Despues

```bash
cd /var/www/betel-reus
sudo -u betel git pull origin main
sudo -u betel npm ci
sudo -u betel npm run check
sudo systemctl restart betel-reus
```

## Problemas Frecuentes

### 403

OpenLiteSpeed esta sirviendo una carpeta estatica vacia o el virtual host no esta proxyando a Node.

Revisa:

- External App `betel_node`.
- Rewrite rules.
- Graceful Restart.
- Que `curl http://127.0.0.1:3000` funcione dentro del VPS.

### 502 / 503

Node no esta arrancado o OpenLiteSpeed no llega al puerto.

```bash
sudo systemctl status betel-reus
journalctl -u betel-reus -n 100
```

### source memory

Falta `DATABASE_URL` o el servicio no ha sido reiniciado despues de cambiar variables.

```bash
sudo systemctl restart betel-reus
```

### Admin No Entra

Revisa `ADMIN_CODE` en:

```text
/etc/betel-reus/betel-reus.env
```
