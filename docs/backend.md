# Investigacion Backend - Rapiti
**Autor:** Ciro (Backend Developer)
**Proyecto:** Rapiti - Comparador de Precios de Tehuacan

---

## Stack Tecnologico

| Tecnologia | Proposito |
|------------|-----------|
| Node.js 20 LTS | Runtime JavaScript servidor |
| Express.js 4.x | Framework APIs REST |
| PostgreSQL 15+ | Base de datos |
| JWT | Autenticacion |
| Bcrypt | Hash de contrasenas |

---

## Arquitectura de 3 Capas

```
Frontend (React) → Backend (Node/Express) → Base de Datos (PostgreSQL)
```

**Estructura:**
```
backend/
├── src/
│   ├── routes/        # Endpoints API
│   ├── controllers/   # Logica de negocio
│   ├── middlewares/   # Auth, validaciones
│   └── config/        # Conexion BD
└── database/
    └── migrations/    # Scripts SQL
```

---

## Endpoints API

**Publicos:**
- `GET /api/productos` - Listar productos
- `GET /api/buscar?q=` - Buscar productos
- `GET /api/tiendas` - Listar tiendas
- `POST /api/auth/login` - Iniciar sesion

**Privados (tienda):**
- `GET /api/tienda/productos` - Mis productos
- `PUT /api/tienda/precios/:id` - Actualizar precio

**Privados (admin):**
- `POST /api/admin/tiendas` - Crear tienda
- `POST /api/admin/usuarios` - Crear usuario
- `POST /api/admin/productos` - Crear producto

---

## Rutas Publicas vs Privadas

| Ruta Frontend | Tipo | Autenticacion |
|---------------|------|---------------|
| `/` | Publica | No |
| `/buscar` | Publica | No |
| `/login` | Publica | No |
| `/tienda/panel` | Privada | JWT (tienda) |
| `/admin/*` | Privada | JWT (admin) |

---

*Ver PDF para documentacion completa*
