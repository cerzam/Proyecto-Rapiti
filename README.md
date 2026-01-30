# RapiTi - Comparador de Precios Locales

RapiTi es una aplicación web diseñada para permitir a los usuarios comparar precios de productos básicos en tiendas locales de la zona metropolitana de Puebla, ayudando a ahorrar tiempo y dinero.

## Equipo de Desarrollo

| Rol | Integrante |
|-----|------------|
| Team Leader (TL) | Héctor Ulises Cacho González |
| Backend (BE) | Ciro Julián Cervantes Zamora |
| Frontend (FE) | Dana Lizbeth Castañeda Sánchez |
| QA Testing (QA) | Concepción Guadalupe Paniagua González |
| DevOps (DO) | Oscar Yael Hernández Rodríguez |

## Tecnologías

| Capa | Tecnología |
|------|------------|
| Frontend | React + Tailwind CSS |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| Infraestructura | Docker |
| CI/CD | GitHub Actions |

## Arquitectura General

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│    Backend      │────▶│   PostgreSQL    │
│  React + Vite   │     │  Node + Express │     │   Base de Datos │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

- **Frontend**: Aplicación web SPA (Single Page Application)
- **Backend**: API REST para gestión de datos
- **Base de Datos**: Almacenamiento relacional de productos, precios y tiendas

## Instalación con Docker

```bash
# Construir la imagen
docker build -t rapiti .

# Ejecutar el contenedor
docker run -p 3000:3000 rapiti
```

## Estructura del Proyecto

```
equipo6-rapiti/
├── backend/            # API REST (Node.js + Express)
├── frontend/           # Aplicación web (React + Tailwind)
├── Docs/               # Documentación del proyecto
│   ├── Definicion-General/
│   ├── E1-Investigacion/
│   └── E2-UXUI/
├── Dockerfile          # Configuración de Docker
└── .github/workflows/  # Pipeline CI/CD
```

## Documentación

La documentación del proyecto se encuentra en la carpeta `Docs/`:

- **Definicion-General/** - Alcance y objetivos del proyecto
- **E1-Investigacion/** - Investigaciones individuales y grupal
- **E2-UXUI/** - Diseño UX/UI y Sitemap
