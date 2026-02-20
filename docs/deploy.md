# Deploy - Rapiti

## URLs de Producción

| Servicio | URL | Plataforma |
|----------|-----|------------|
| **Frontend** | https://rapiti-web.netlify.app | Netlify |
| **Backend** | https://------------------------ .com | Render |

## Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Health check - "Backend de Rapiti funcionando" |
| GET | `/api/productos` | Lista de productos (demo) |
| POST | `/api/productos` | Crear producto |
| GET | `/api/test/test-error` | Test de error 500 |

## Variables de Entorno

### Backend (Render)
```env
PORT=3000
NODE_ENV=production
```

## Deploy Automático

Ambos servicios están configurados para **deploy automático** cuando se hace push a la rama `main`.

```
git push origin main → GitHub → Netlify/Render → Redeploy (~1-2 min)
```

## Notas

- **Cold Start**: El backend en Render (plan gratuito) puede tardar ~30 segundos en responder si ha estado inactivo por 15 minutos.
- **Delay**: El backend tiene un middleware de delay de 2 segundos (simulación de latencia).
