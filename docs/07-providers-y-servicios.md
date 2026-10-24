# 07. Providers y servicios

Un provider es una dependencia que Nest puede construir y entregar a otras clases. Un service suele ser un provider marcado con `@Injectable()` y contiene operaciones reutilizables, como reglas de negocio o acceso a repositorios.

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  findAll() {
    return [{ id: 1, name: 'Café', price: 12.5 }];
  }
}
```

Registrar el service en `providers` permite al contenedor de Nest administrarlo:

```ts
@Module({ providers: [ProductsService] })
export class ProductsModule {}
```

El controller lo recibe mediante el constructor. Esto facilita sustituirlo por un fake en una prueba y evita que el controller conozca cómo construir la dependencia.

## Referencias

- [Providers](https://docs.nestjs.com/providers)
- [Testing](https://docs.nestjs.com/fundamentals/testing)
