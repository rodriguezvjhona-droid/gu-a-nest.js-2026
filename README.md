# Guía de NestJS 2026

Guía progresiva en español para aprender NestJS con TypeScript y construir APIs mantenibles. Si quieres empezar por algo que puedas ejecutar, ve a [la API mínima de productos](examples/productos-api/README.md).

## Contenido disponible

- [Diagnóstico del repositorio y plan](docs/00-diagnostico-y-plan.md)
- [01. Fundamentos: de Node.js a una petición NestJS](docs/01-fundamentos.md)
- [02. TypeScript útil para NestJS](docs/02-typescript-para-nestjs.md)
- [03. Instalación y CLI](docs/03-instalacion-y-cli.md)
- [04. Estructura del proyecto](docs/04-estructura-del-proyecto.md)
- [05. Módulos](docs/05-modulos.md)
- [06. Controladores y rutas](docs/06-controladores-y-rutas.md)
- [07. Providers y servicios](docs/07-providers-y-servicios.md)
- [08. Inyección de dependencias](docs/08-inyeccion-dependencias.md)
- [Ejemplo integrado: API de productos](examples/productos-api/README.md)

Los siguientes capítulos se agregarán por fases y se enlazarán aquí al tener ejemplos completos.

## Requisitos actuales

La documentación oficial consultada en octubre de 2026 corresponde a NestJS 12. Esta versión requiere Node.js 20.19+ o 22.12+ para ejecutar una app; los generadores de Nest CLI requieren Node.js 22.22.3+, 24.15+ o 26+. Comprueba los requisitos en [First steps](https://docs.nestjs.com/first-steps) y [CLI overview](https://docs.nestjs.com/cli/overview) antes de comenzar, porque pueden cambiar.

## Cómo estudiar

1. Lee el capítulo y ejecuta los comandos en tu terminal.
2. Copia el ejemplo integrado a una carpeta de trabajo.
3. Ejecuta `npm run start:dev` y prueba los endpoints con `curl`, Postman o Insomnia.
4. Cambia una cosa a la vez y observa cómo el módulo conecta el controlador con el servicio.
5. Sigue después con DTO y validación, persistencia y seguridad.

## Fuentes principales

- [Documentación oficial de NestJS](https://docs.nestjs.com/)
- [Primeros pasos](https://docs.nestjs.com/first-steps)
- [Controladores](https://docs.nestjs.com/controllers)
- [Providers](https://docs.nestjs.com/providers)
- [Módulos](https://docs.nestjs.com/modules)

