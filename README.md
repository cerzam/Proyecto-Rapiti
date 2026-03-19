# RapiTi - Comparador de Precios Locales

RapiTi es una aplicación web diseñada para permitir a los usuarios comparar precios de productos básicos en tiendas locales de la zona metropolitana de Puebla, ayudando a ahorrar tiempo y dinero.

## Demo en Vivo

**Prueba la aplicación desplegada:**

https://rapiti-web.netlify.app

## Prueba Login
- Correo: tienda@rapiti.com
- Contraseña: 12345678

## Equipo de Desarrollo

- Héctor Ulises Cacho González
- Ciro Julián Cervantes Zamora
- Dana Lizbeth Castañeda Sánchez
- Concepción Guadalupe Paniagua González
- Oscar Yael Hernández Rodríguez

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

## Desarrollo local (Frontend)

### Requisitos previos

- Node.js 20+
- npm 10+

### Instalación

```bash
cd frontend
npm install
```

### Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build de producción |
| `npm run lint` | Linting con ESLint + accesibilidad (jsx-a11y) |
| `npm test` | Ejecutar tests unitarios (Vitest) |
| `npm run test:watch` | Tests en modo watch |
| `npm run preview` | Preview del build |

### Ejecutar tests

```bash
cd frontend

# Correr todos los tests una vez
npm test

# Correr tests en modo watch (re-ejecuta al guardar)
npm run test:watch
```

Los tests usan **Vitest** + **Testing Library** y validan:
- Renderizado de componentes
- Accesibilidad (atributos alt, roles ARIA, navegación por teclado)
- Interacción de usuario (click, teclado, focus)

### Probar accesibilidad localmente

```bash
cd frontend

# Revisar reglas de accesibilidad con ESLint + jsx-a11y
npm run lint
```

El plugin `eslint-plugin-jsx-a11y` detecta automáticamente:
- Imágenes sin atributo `alt`
- Botones sin `aria-label` (cuando no tienen texto)
- Elementos interactivos sin soporte de teclado
- Roles ARIA inválidos
- `tabindex` positivo (mala práctica)
- Labels faltantes en formularios

## Pipeline CI/CD

El pipeline de GitHub Actions (`.github/workflows/ci.yml`) ejecuta 3 jobs en cada push/PR a `main`:

1. **Lint + Accesibilidad** - Corre ESLint con reglas jsx-a11y
2. **Tests unitarios** - Ejecuta Vitest
3. **Build + Docker** - Solo si lint y tests pasan

**No se puede hacer merge si lint o tests fallan.**

## Estructura del Proyecto

```
equipo6-rapiti/
├── backend/                # API REST (Node.js + Express)
├── frontend/               # Aplicación web (React + Tailwind)
│   ├── src/
│   │   ├── components/     # Componentes reutilizables (Navbar)
│   │   ├── views/          # Vistas (Home, Buscador, Login)
│   │   ├── test/           # Setup de testing
│   │   └── *.test.jsx      # Tests unitarios
│   ├── eslint.config.js    # ESLint + jsx-a11y
│   └── vite.config.js      # Vite + Vitest config
├── docs/                   # Documentación del proyecto
│   ├── Definicion-Proyecto/
│   ├── S2-Investigaciones/
│   ├── S3-UXUI/
│   ├── S4-Navegacion/
│   ├── S5-DOM-/
│   └── S6-Event/
├── Dockerfile              # Configuración de Docker
└── .github/workflows/      # Pipeline CI/CD
```

## Documentación

La documentación del proyecto se encuentra en la carpeta `docs/`:

- **Definicion-Proyecto/** - Alcance y objetivos del proyecto
- **S2-Investigaciones/** - Investigaciones individuales y grupal
- **S3-UXUI/** - Diseño UX/UI y guía accesible
- **S4-Navegacion/** - Navegación y flujo de usuario
