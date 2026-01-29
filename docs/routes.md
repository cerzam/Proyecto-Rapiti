# API Routes - Proyecto Rapiti

**Comparador de Precios de Tehuacan - MVP**

---

## Resumen de Endpoints

| Seccion | Endpoints | Acceso |
|---------|-----------|--------|
| Autenticacion | 1 | Publico |
| Productos | 2 | Publico |
| Tiendas | 2 | Publico |
| Busqueda | 1 | Publico |
| Panel Tienda | 2 | JWT (tienda) |
| Panel Admin | 4 | JWT (admin) |

**Total: 12 endpoints**

---

## Autenticacion

### Iniciar sesion

```
POST /api/auth/login
```

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response exitosa:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "usuario": {
      "id": 1,
      "email": "tienda@ejemplo.com",
      "rol": "tienda",
      "tiendaId": 5
    }
  }
}
```

> Nota: No hay registro publico. Solo admin crea usuarios.

---

## Productos (Publico)

### Listar productos

```
GET /api/productos
```

**Response:**
```json
{
  "success": true,
  "data": {
    "productos": [
      {
        "id": 1,
        "nombre": "Leche Lala Entera 1L",
        "categoria": "Lacteos",
        "imagen_url": "/images/leche.jpg"
      }
    ],
    "total": 15
  }
}
```

### Detalle de producto con precios

```
GET /api/productos/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "producto": {
      "id": 1,
      "nombre": "Leche Lala Entera 1L",
      "categoria": "Lacteos"
    },
    "precios": [
      {
        "tienda_id": 1,
        "tienda_nombre": "Abarrotes Don Juan",
        "precio": 22.00,
        "actualizado": "2026-01-28"
      },
      {
        "tienda_id": 2,
        "tienda_nombre": "Oxxo Centro",
        "precio": 25.00,
        "actualizado": "2026-01-27"
      }
    ]
  }
}
```

---

## Tiendas (Publico)

### Listar tiendas

```
GET /api/tiendas
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tiendas": [
      {
        "id": 1,
        "nombre": "Abarrotes Don Juan",
        "direccion": "Calle 5 #123, Col. Morelos",
        "latitud": 18.4620,
        "longitud": -97.3929,
        "telefono": "238-123-4567"
      }
    ],
    "total": 5
  }
}
```

### Detalle de tienda

```
GET /api/tiendas/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tienda": {
      "id": 1,
      "nombre": "Abarrotes Don Juan",
      "direccion": "Calle 5 #123, Col. Morelos",
      "latitud": 18.4620,
      "longitud": -97.3929
    },
    "productos": [
      {
        "id": 1,
        "nombre": "Leche Lala 1L",
        "precio": 22.00
      }
    ]
  }
}
```

---

## Busqueda (Publico)

### Buscar productos

```
GET /api/buscar?q={termino}
```

**Ejemplo:** `GET /api/buscar?q=leche`

**Response:**
```json
{
  "success": true,
  "data": {
    "resultados": [
      {
        "id": 1,
        "nombre": "Leche Lala Entera 1L",
        "precios": [
          { "tienda": "Don Juan", "precio": 22.00 },
          { "tienda": "Bodega", "precio": 24.00 },
          { "tienda": "Oxxo", "precio": 25.00 }
        ]
      }
    ],
    "total": 1,
    "busqueda": "leche"
  }
}
```

---

## Panel Tienda (Requiere JWT rol "tienda")

**Headers requeridos:**
```
Authorization: Bearer {token}
```

### Ver mis productos con precios

```
GET /api/tienda/productos
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tienda": "Abarrotes Don Juan",
    "productos": [
      {
        "id": 1,
        "nombre": "Leche Lala 1L",
        "mi_precio": 22.00,
        "actualizado": "2026-01-28"
      },
      {
        "id": 2,
        "nombre": "Huevo 12 pzas",
        "mi_precio": 45.00,
        "actualizado": "2026-01-25"
      }
    ]
  }
}
```

### Actualizar precio

```
PUT /api/tienda/precios/:productoId
```

**Body:**
```json
{
  "precio": 23.50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Precio actualizado",
  "data": {
    "producto": "Leche Lala 1L",
    "precio_anterior": 22.00,
    "precio_nuevo": 23.50,
    "actualizado": "2026-01-29"
  }
}
```

---

## Panel Admin (Requiere JWT rol "admin")

**Headers requeridos:**
```
Authorization: Bearer {token}
```

### Crear tienda

```
POST /api/admin/tiendas
```

**Body:**
```json
{
  "nombre": "Abarrotes Lupita",
  "direccion": "Av. Reforma #456",
  "latitud": 18.4650,
  "longitud": -97.3950,
  "telefono": "238-987-6543"
}
```

### Crear usuario para tienda

```
POST /api/admin/usuarios
```

**Body:**
```json
{
  "email": "lupita@tienda.com",
  "password": "temporal123",
  "rol": "tienda",
  "tiendaId": 6
}
```

### Crear producto

```
POST /api/admin/productos
```

**Body:**
```json
{
  "nombre": "Pan Bimbo Grande",
  "categoriaId": 2,
  "imagenUrl": "/images/pan-bimbo.jpg"
}
```

### Asignar precio inicial

```
POST /api/admin/precios
```

**Body:**
```json
{
  "productoId": 1,
  "tiendaId": 6,
  "precio": 24.00
}
```

---

## Codigos de Estado HTTP

| Codigo | Significado |
|--------|-------------|
| 200 | OK - Exito |
| 201 | Creado |
| 400 | Datos invalidos |
| 401 | No autenticado (sin token) |
| 403 | No autorizado (rol incorrecto) |
| 404 | No encontrado |
| 500 | Error del servidor |

---

## Formato de Errores

```json
{
  "success": false,
  "error": {
    "code": "PRODUCTO_NO_ENCONTRADO",
    "message": "El producto con ID 99 no existe"
  }
}
```

---

*MVP Rapiti - 12 endpoints totales*
