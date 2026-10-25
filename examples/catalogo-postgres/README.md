# API de catálogo: NestJS + PostgreSQL + TypeORM

Ejemplo didáctico que conecta la aplicación con PostgreSQL e implementa CRUD de productos y categorías. Incluye DTO con `class-validator`, `ValidationPipe` global, `ParseIntPipe`, middleware de request id y request logging. El guard de roles se explica en `docs/13-guards.md`; este ejemplo no finge tener autenticación: sus rutas son públicas para facilitar el aprendizaje.

## Requisitos

- Node.js según los requisitos publicados por la versión de NestJS que instales.
- Nest CLI compatible con tu Node para generar el proyecto.
- Docker Desktop o Docker Engine con Docker Compose.
- PostgreSQL 18 (el ejemplo lo levanta en el contenedor).

## Crear proyecto e instalar paquetes

En una terminal, desde la carpeta en la que guardas tus proyectos:

```bash
npm install --global @nestjs/cli
nest new catalog-api
cd catalog-api
npm install @nestjs/config @nestjs/typeorm@^12 typeorm pg class-validator class-transformer
npm install --save-dev @types/express
```

Copia `src/`, `db/`, `docker-compose.yml` y `.env.example` de este ejemplo dentro de la raíz de `catalog-api`. Renombra `.env.example` a `.env` para el entorno local y confirma que `.env` figure en `.gitignore` antes de guardar secretos locales.

Las versiones exactas de `@nestjs/typeorm` y TypeORM deben ser compatibles entre sí. En la documentación consultada en octubre de 2026, `@nestjs/typeorm` 12 soporta TypeORM 0.3 o 1.x. No copies a ciegas una versión antigua de un tutorial.

## Levantar PostgreSQL

Desde la raíz del proyecto que contiene `docker-compose.yml`:

```bash
docker compose up -d db
docker compose ps
```

Espera a que `db` indique `healthy`. La primera inicialización crea `catalog_db`, el usuario de desarrollo, las tablas y dos categorías iniciales mediante `db/init.sql`.

**El SQL de `db/init.sql` solo se ejecuta cuando PostgreSQL inicializa un volumen vacío.** Si cambias ese archivo después de haber creado el volumen, Postgres no lo vuelve a ejecutar. Para datos descartables de desarrollo se puede eliminar el volumen con `docker compose down -v` y volver a subir; ese comando borra los datos locales del contenedor, úsalo solo si sabes que no necesitas conservarlos. En proyectos persistentes, versiona cambios de esquema mediante migraciones.

## Ejecutar la API

```bash
npm run start:dev
```

El starter del CLI contiene sus scripts en `package.json`; verifica que `start:dev` esté disponible. La API escucha en `http://localhost:3000` (o en el valor de `PORT`).

## Probar endpoints

```bash
curl.exe http://localhost:3000/categories
curl.exe -X POST http://localhost:3000/categories -H "Content-Type: application/json" -d '{"name":"Alimentos"}'
curl.exe http://localhost:3000/products
curl.exe -X POST http://localhost:3000/products -H "Content-Type: application/json" -d '{"name":"Pan","description":"Pan artesanal","priceInCents":425,"categoryId":1}'
curl.exe http://localhost:3000/products/1
curl.exe -X PATCH http://localhost:3000/products/1 -H "Content-Type: application/json" -d '{"priceInCents":500}'
curl.exe -X PUT http://localhost:3000/products/1 -H "Content-Type: application/json" -d '{"name":"Pan integral","priceInCents":550,"categoryId":1}'
curl.exe -i -X DELETE http://localhost:3000/products/1
```

`POST` sin categoría existente responde 404. `GET /products/no-es-numero` responde 400 por `ParseIntPipe`. Body inválido o con propiedades inesperadas responde 400 por `ValidationPipe`. DELETE responde 204 sin body.

## Arquitectura de archivos

```text
src/
  main.ts                         # bootstrap y ValidationPipe global
  app.module.ts                   # Config, TypeORM y módulos de dominio
  common/guards/                  # RolesGuard de referencia (requiere auth previa)
  common/middleware/              # request id y log de acceso
  categories/                     # CRUD de categorías
    dto/
    category.entity.ts
    categories.controller.ts
    categories.service.ts
    categories.module.ts
  products/                       # CRUD de productos
    dto/
    product.entity.ts
    products.controller.ts
    products.service.ts
    products.module.ts
db/init.sql                       # esquema inicial local para Docker
```

## Qué NO cubre este ejemplo

- No incluye autenticación ni autorización conectada. Revisa el guard de roles en el capítulo 13 y añade una estrategia JWT antes de exponer rutas protegidas.
- No incluye migrador TypeORM ejecutable. `init.sql` solo inicializa la base para aprender; los cambios de esquema de una app que evoluciona deben pasar a migraciones revisables.
- Las credenciales de `.env.example` son solo para desarrollo local y no se deben reutilizar en producción.
- La paginación y el mapeo central de errores del driver se explican en capítulos siguientes.

## Fuentes oficiales

- [NestJS database overview](https://docs.nestjs.com/data/overview)
- [NestJS TypeORM integration](https://docs.nestjs.com/data/typeorm)
- [Validation](https://docs.nestjs.com/techniques/validation)
- [Pipes](https://docs.nestjs.com/pipes)
- [Middleware](https://docs.nestjs.com/middleware)
- [PostgreSQL](https://www.postgresql.org/docs/)
