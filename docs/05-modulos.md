# 05. Módulos

## Qué son

Un módulo es una clase decorada con `@Module()`. Su metadata describe qué controllers pertenecen al módulo, qué providers puede crear y qué dependencias importa o exporta.

```ts
@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
```

- `controllers`: controladores HTTP administrados por el módulo.
- `providers`: clases y valores que el contenedor puede inyectar dentro del módulo.
- `imports`: otros módulos cuyos providers exportados se necesitan.
- `exports`: providers que este módulo ofrece a módulos que lo importan.

El módulo raíz se carga en `main.ts` a través de `NestFactory.create(AppModule)`. Cada módulo de funcionalidad debe importarse desde el raíz para formar parte de la app.

## Ejemplo conectado

```ts
// src/app.module.ts
@Module({ imports: [ProductsModule] })
export class AppModule {}
```

`ProductsModule` registra `ProductsController` y `ProductsService`; el controller recibe el service por constructor. No es necesario instanciarlo con `new`.

## Cuándo exportar

Exporta un provider cuando otro módulo necesita inyectarlo. No exportes todo por defecto; mantener providers internos reduce acoplamiento.

## Referencias

- [Documentación oficial de módulos](https://docs.nestjs.com/modules)
- [Módulos dinámicos](https://docs.nestjs.com/fundamentals/dynamic-modules)
