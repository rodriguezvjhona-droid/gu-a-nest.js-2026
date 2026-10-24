# 06. Controladores y rutas

Un controller recibe la petición HTTP, obtiene los parámetros y delega trabajo a un provider. Evita colocar lógica de negocio compleja en el controller.

```ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return { id, name: 'Café', price: 12.5 };
  }
}
```

`@Controller('products')` agrega el prefijo. `@Get(':id')` coincide con `GET /products/123`. `@Param()` extrae el segmento y `ParseIntPipe` convierte texto a entero o produce un error HTTP 400 si no puede hacerlo.

## Métodos comunes

| Decorador | HTTP | Uso normal |
|---|---|---|
| `@Get()` | GET | leer recurso o colección |
| `@Post()` | POST | crear un recurso |
| `@Put(':id')` | PUT | reemplazar el recurso completo |
| `@Patch(':id')` | PATCH | cambiar algunos campos |
| `@Delete(':id')` | DELETE | borrar un recurso |

## Parámetros usuales

```ts
@Get()
findAll(@Query('search') search?: string) { /* ... */ }

@Post()
create(@Body() body: CreateProductDto) { /* ... */ }

@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) { /* ... */ }
```

Nest responde JSON al valor que devuelve el handler. `@Res()` permite controlar la respuesta directamente, pero cambia el modo de respuesta y puede obligar a escribir más código de plataforma; úsalo cuando realmente se necesite.

## Ejercicio resuelto

```ts
@Get('saludo/:nombre')
saludar(@Param('nombre') nombre: string) {
  return { mensaje: `Hola, ${nombre}` };
}
```

En un controller real, declara `@Controller('saludo')` y la ruta como `@Get(':nombre')` para formar `GET /saludo/:nombre`.

## Referencias

- [Controladores](https://docs.nestjs.com/controllers)
- [Pipes](https://docs.nestjs.com/pipes)
