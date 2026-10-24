# 04. Estructura del proyecto

El CLI crea un starter. Los nombres exactos pueden cambiar entre versiones y opciones de plantilla. Este árbol muestra una organización por funcionalidad para una API pequeña:

```text
src/
  main.ts
  app.module.ts
  products/
    products.module.ts
    products.controller.ts
    products.service.ts
    dto/
      create-product.dto.ts
      update-product.dto.ts
```

- `main.ts` crea la aplicación y la pone a escuchar.
- `app.module.ts` es el módulo raíz que conecta los módulos de funcionalidades.
- `products.module.ts` registra lo que pertenece al dominio de productos.
- `products.controller.ts` declara endpoints HTTP.
- `products.service.ts` contiene las operaciones que el controller delega.
- `dto/` contiene contratos de entrada/salida; más adelante se añadirán validadores runtime.

Para una app más grande se pueden crear módulos `categories`, `auth`, `database` y otros. No es necesario crear una capa por cada clase: agrega abstracciones cuando ayuden a separar responsabilidades.

## Punto de entrada

```ts
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
```

`NestFactory.create()` construye el contenedor usando el módulo raíz y prepara el adaptador HTTP. `listen()` comienza a aceptar conexiones.

## Referencias

- [Primeros pasos](https://docs.nestjs.com/first-steps)
- [Módulos](https://docs.nestjs.com/modules)
