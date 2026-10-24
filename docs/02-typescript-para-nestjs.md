# 02. TypeScript útil para NestJS

No hace falta conocer todo TypeScript para empezar. Estos elementos aparecen constantemente en proyectos Nest.

## Tipos para datos

```ts
const nombre: string = 'Café';
const precio: number = 12.5;
const disponible: boolean = true;
```

Los tipos ayudan al editor y al compilador a detectar usos incompatibles. No validan automáticamente el JSON que llega por HTTP: eso se hace en runtime mediante pipes y esquemas de validación.

## `type` e `interface`

Ambos describen formas de datos. Un `interface` es común para contratos extensibles; un `type` puede representar uniones y composiciones más variadas.

```ts
export interface Product {
  id: number;
  name: string;
  price: number;
}

export type ProductStatus = 'active' | 'archived';
```

Un tipo TypeScript se borra al compilar. Por eso el servidor no puede inspeccionar una interface para validar una petición HTTP.

## Clases y métodos

Nest usa clases como módulos, controladores y providers. Los decoradores adjuntan metadatos a esas clases o métodos.

```ts
export class PriceCalculator {
  withTax(price: number, taxRate: number): number {
    return price * (1 + taxRate);
  }
}
```

## Genéricos

Los genéricos permiten escribir estructuras reutilizables y conservar el tipo concreto.

```ts
export interface Page<T> {
  items: T[];
  total: number;
}

const productsPage: Page<Product> = {
  items: [{ id: 1, name: 'Café', price: 12.5 }],
  total: 1,
};
```

## `Promise` y `async/await`

Operaciones de red y base de datos suelen ser asíncronas. Una función `async` devuelve una `Promise`.

```ts
async function loadProduct(id: number): Promise<Product | null> {
  // En una app real, aquí se consultaría una base de datos.
  return id === 1 ? { id: 1, name: 'Café', price: 12.5 } : null;
}
```

Un método de controlador puede devolver el valor directamente o una `Promise`. Nest espera la promesa antes de responder.

## Decoradores

Un decorador es sintaxis TypeScript que llama una función para asociar metadatos o modificar una declaración. En Nest, por ejemplo, `@Controller()` y `@Get()` describen cómo registrar rutas.

```ts
@Controller('products')
export class ProductsController {
  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id };
  }
}
```

Nest lee estos metadatos al iniciar y prepara el enrutamiento. Los decoradores no sustituyen la implementación del método.

## Tipos no equivalen a validación

El cliente puede mandar cualquier JSON. Aunque el parámetro esté anotado como `CreateProductDto`, esa anotación por sí sola no comprueba los campos en tiempo de ejecución. Para validar se necesita una solución runtime, como `ValidationPipe` con `class-validator`, o un pipe basado en Zod.

## Referencias

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [NestJS: primeros pasos](https://docs.nestjs.com/first-steps)
- [NestJS: validación](https://docs.nestjs.com/techniques/validation)
