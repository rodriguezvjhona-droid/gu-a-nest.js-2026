# 03. Instalación y Nest CLI

## Comprueba el entorno

En la terminal:

```bash
node --version
npm --version
```

Para NestJS 12, la documentación vigente indica Node.js 20.19+ o 22.12+ para ejecutar una app. Los comandos generadores del CLI requieren Node.js 22.22.3+, 24.15+ o 26+. Consulta [First steps](https://docs.nestjs.com/first-steps) y [CLI overview](https://docs.nestjs.com/cli/overview) antes de instalar: son requisitos sensibles a versión.

## Crear una app

```bash
npm install --global @nestjs/cli
nest new tienda-api
cd tienda-api
npm run start:dev
```

El CLI crea el proyecto, instala dependencias y configura TypeScript. Si no quieres instalar el CLI globalmente, puedes usar `npx @nestjs/cli` en los comandos compatibles con tu versión.

Al iniciar, la terminal mostrará que la aplicación está escuchando. El starter básico responde en `http://localhost:3000/`.

## Generar piezas

Ejecuta desde la raíz del proyecto:

```bash
nest generate module products
nest generate controller products
nest generate service products
```

El alias `nest g` es equivalente a `nest generate`. Verifica `nest --help` para las opciones de la versión instalada.

## Scripts típicos

```bash
npm run start:dev  # desarrollo con recarga
npm run build      # compilar
npm run start:prod # ejecutar la salida compilada, según scripts del proyecto
```

Los nombres exactos de scripts se leen en `package.json`. No todos los starters son idénticos; usa los que haya generado tu CLI.

## Comandos npm básicos

```bash
npm install @nestjs/config       # instalar dependencia de ejecución
npm install --save-dev paquete   # instalar dependencia de desarrollo
npm uninstall paquete            # quitar dependencia
```

## Referencias

- [Primeros pasos oficiales](https://docs.nestjs.com/first-steps)
- [Nest CLI](https://docs.nestjs.com/cli/overview)
- [Generación de recursos CRUD](https://docs.nestjs.com/recipes/crud-generator)
