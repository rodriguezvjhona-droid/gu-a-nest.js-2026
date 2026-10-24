# API mínima de productos (TypeScript)

Ejemplo didáctico para ver el recorrido completo `módulo → controlador → servicio`. Mantiene datos en memoria y no requiere una base de datos.

## Requisitos y ejecución

1. Instala Node.js compatible con NestJS 12; revisa los requisitos en [First steps](https://docs.nestjs.com/first-steps).
2. Crea un starter: `npm i -g @nestjs/cli` y luego `nest new tienda-api`.
3. Elige TypeScript y entra a `tienda-api`.
4. Reemplaza o agrega los archivos que siguen bajo `src/`.
5. Ejecuta `npm run start:dev`.
6. Prueba `GET http://localhost:3000/products`.

El starter del CLI incluye `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `reflect-metadata` y RxJS como parte de su configuración. Para este ejemplo no necesitas ORM ni PostgreSQL.

## Estructura

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

## `src/main.ts`

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
```

## `src/app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';

@Module({ imports: [ProductsModule] })
export class AppModule {}
```

## `src/products/dto/create-product.dto.ts`

```ts
export class CreateProductDto {
  name!: string;
  price!: number;
}
```

El signo `!` indica a TypeScript que el valor se asignará después. Por sí solo no valida el JSON recibido; la versión de este ejemplo es intencionalmente mínima. Un capítulo posterior agregará validación runtime para rechazar tipos incorrectos y campos no permitidos.

## `src/products/dto/update-product.dto.ts`

```ts
export class UpdateProductDto {
  name?: string;
  price?: number;
}
```

Los campos opcionales representan una actualización parcial. La diferencia entre una forma de datos TypeScript y una validación de entrada en runtime se explica en el capítulo de DTO y validación.

## `src/products/products.service.ts`

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [
    { id: 1, name: 'Café', price: 12.5 },
    { id: 2, name: 'Té', price: 8 },
  ];

  private nextId = 3;

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find((item) => item.id === id);
    if (!product) throw new NotFoundException(`No existe el producto ${id}`);
    return product;
  }

  create(input: CreateProductDto): Product {
    const product: Product = { id: this.nextId++, ...input };
    this.products.push(product);
    return product;
  }

  update(id: number, input: UpdateProductDto): Product {
    const product = this.findOne(id);
    Object.assign(product, input);
    return product;
  }

  remove(id: number): void {
    const index = this.products.findIndex((item) => item.id === id);
    if (index === -1) throw new NotFoundException(`No existe el producto ${id}`);
    this.products.splice(index, 1);
  }
}
```

## `src/products/products.controller.ts`

```ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.productsService.remove(id);
    return { message: 'Producto eliminado' };
  }
}
```

## `src/products/products.module.ts`

```ts
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
```

## Prueba manual

```bash
curl http://localhost:3000/products
curl http://localhost:3000/products/1
curl -X POST http://localhost:3000/products -H "Content-Type: application/json" -d '{"name":"Pan","price":4.25}'
curl -X PATCH http://localhost:3000/products/1 -H "Content-Type: application/json" -d '{"price":13}'
curl -X DELETE http://localhost:3000/products/2
```

En PowerShell, `curl` puede ser un alias de `Invoke-WebRequest`; para usar el ejecutable real escribe `curl.exe` o prueba con Postman/Insomnia.

## Qué debes observar

1. `main.ts` inicia la aplicación desde `AppModule`.
2. `AppModule` importa `ProductsModule`.
3. `ProductsModule` registra controller y service.
4. `ProductsController` recibe el service mediante DI.
5. El service contiene las operaciones CRUD y lanza `NotFoundException` cuando falta un producto.
6. Nest transforma esa excepción en una respuesta HTTP 404.

Los datos viven solo en memoria. Reiniciar la app los restaura a los datos de ejemplo. No uses este almacenamiento para producción. Más adelante se reemplazará `ProductsService` por acceso a PostgreSQL y se añadirá validación de DTO.

## Fuentes oficiales

- [First steps](https://docs.nestjs.com/first-steps)
- [Controllers](https://docs.nestjs.com/controllers)
- [Providers](https://docs.nestjs.com/providers)
- [Modules](https://docs.nestjs.com/modules)
- [Exception filters](https://docs.nestjs.com/exception-filters)
