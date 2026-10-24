# Guía de NestJS 2026

Guía progresiva en español para aprender NestJS y construir APIs mantenibles con TypeScript. El repositorio se encuentra en su fase inicial: el diagnóstico y el mapa de capítulos están en [docs/00-diagnostico-y-plan.md](docs/00-diagnostico-y-plan.md).

## Alcance y vigencia

La referencia principal es la documentación oficial de NestJS. Al preparar esta primera fase, la documentación oficial presenta NestJS 12 como la versión actual. Como el ecosistema cambia, cada capítulo que recomiende versiones o comandos indicará la fecha de consulta y enlazará la fuente primaria. No se fijan versiones de dependencias en esta página como si fueran permanentes.

Para empezar, verifica las versiones de Node.js que requiere la versión actual de Nest para ejecutar una aplicación y para usar Nest CLI; estos requisitos pueden ser distintos. Consulta [First steps](https://docs.nestjs.com/first-steps) y [CLI overview](https://docs.nestjs.com/cli/overview).

## Ruta de aprendizaje

1. [Diagnóstico y plan editorial](docs/00-diagnostico-y-plan.md)
2. Fundamentos de Node.js, TypeScript, HTTP y arquitectura NestJS
3. Estructura de proyecto, módulos, controladores, providers e inyección de dependencias
4. Decoradores y ciclo de vida de una petición
5. DTO, validación, transformación, pipes, middleware, guards, interceptors y filtros
6. Persistencia con PostgreSQL y TypeORM; comparación con Prisma
7. Configuración, autenticación, autorización, OpenAPI y pruebas
8. Rendimiento, observabilidad, colas, WebSockets, microservicios y GraphQL
9. Despliegue y proyecto integral de productos y categorías
10. Glosario, catálogo de paquetes y diagnóstico de errores

## Índice

El índice detallado de capítulos se mantendrá aquí a medida que cada capítulo tenga contenido sustantivo y ejemplos coherentes. La estructura aprobada para el libro está descrita en el diagnóstico editorial. No se enlazarán capítulos vacíos como si estuvieran terminados.

## Principios de la guía

- TypeScript es el lenguaje principal de los ejemplos.
- Cada recomendación distingue el núcleo de NestJS de Node.js, adaptadores y paquetes de terceros.
- Los ejemplos usarán nombres y tipos coherentes entre capítulos.
- Se explicará cuándo escoger una opción y cuáles son sus límites y alternativas.
- Las referencias priorizan documentación oficial y repositorios mantenidos por sus autores.
- Los ejercicios incluirán criterios o solución cuando el capítulo esté completo.

## Fuentes principales

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Primeros pasos de NestJS](https://docs.nestjs.com/first-steps)
- [CLI de NestJS](https://docs.nestjs.com/cli/overview)
- [Repositorio oficial de NestJS](https://github.com/nestjs/nest)
