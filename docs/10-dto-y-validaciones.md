# 10. DTO y validación de entrada

## Qué es un DTO

Un **Data Transfer Object (DTO)** declara los campos que una operación acepta o devuelve. Conviene tener DTOs distintos para crear, actualizar y responder: un usuario no debe poder enviar campos internos como `id`, `createdAt` o permisos.

Los tipos de TypeScript se eliminan al compilar. Escribir `@Body() dto: CreateProductDto` no comprueba por sí solo el JSON recibido. Se necesitan validadores que se ejecuten en runtime.

## Instalar validadores

Desde la raíz del proyecto Nest:

```bash
npm install class-validator class-transformer
```

`class-validator` ofrece decoradores de validación; `class-transformer` ayuda a transformar plain objects en instancias de clases y convertir valores. Nest trae `ValidationPipe`, que coordina esos paquetes.

## DTO de creación y actualización

```ts
// create-product.dto.ts
import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsInt()
  @Min(0)
  priceInCents!: number;

  @IsInt()
  @Min(1)
  categoryId!: number;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string | null;
}
```

```ts
// update-product.dto.ts
import { IsInt, IsOptional, IsString, Length, Min, ValidateIf } from 'class-validator';

export class UpdateProductDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Length(2, 100)
  name?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  @Min(0)
  priceInCents?: number;

  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  @Min(1)
  categoryId?: number;

  // Null is allowed to clear this nullable column; undefined means unchanged.
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string | null;
}
```

Cada propiedad de `UpdateProductDto` es opcional y, si aparece, debe cumplir sus validadores. Para proyectos que usan `@nestjs/mapped-types`, `PartialType(CreateProductDto)` puede derivar el DTO parcial; no omitas validadores ni configures mal la herencia. El ejemplo escribe el DTO explícitamente para dejar claro qué campos permite.

## Activar validación global

```ts
// main.ts
import { ValidationPipe } from '@nestjs/common';

const app = await NestFactory.create(AppModule);
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
```

- `transform: true`: transforma la entrada a instancia DTO y permite conversión basada en tipos en los casos soportados.
- `whitelist: true`: elimina propiedades que no tengan decoradores de validación.
- `forbidNonWhitelisted: true`: rechaza propiedades adicionales con HTTP 400 en vez de ignorarlas.

Para APIs públicas suele ser deseable rechazar campos desconocidos, porque un typo no se acepta silenciosamente. No uses `enableImplicitConversion` sin decidir qué conversiones quieres aceptar: por ejemplo, no siempre conviene convertir automáticamente strings a números.

## El servicio recibe datos ya validados

```ts
@Post()
create(@Body() dto: CreateProductDto) {
  return this.productsService.create(dto);
}
```

Si llega `{"name":"x","priceInCents":-1,"categoryId":1}`, la petición falla antes del handler por longitud o mínimo inválido. Si llega un campo `isAdmin` no declarado, `forbidNonWhitelisted` hace que falle también.

La validación sintáctica (tipos, longitudes, formatos) vive en el DTO. Las reglas que dependen de estado —por ejemplo, verificar que exista la categoría— van en el servicio y base de datos.

## DTO de respuesta

No devuelvas automáticamente una entidad de base de datos si contiene columnas internas. Un DTO de respuesta puede exponer solo lo necesario:

```ts
export class ProductResponseDto {
  id!: number;
  name!: string;
  priceInCents!: number;
  categoryId!: number;
}
```

La transformación a ese objeto puede hacerse en el servicio o con interceptors/serialización. La estrategia de serialización tendrá capítulo propio.

## Zod: alternativa runtime

Zod define un esquema ejecutable y deriva un tipo estático del mismo esquema:

```ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  priceInCents: z.number().int().nonnegative(),
  categoryId: z.number().int().positive(),
  description: z.string().max(500).optional(),
}).strict();

export type CreateProductInput = z.infer<typeof createProductSchema>;
```

Para integrarlo con Nest se escribe un `PipeTransform` que ejecute `schema.parse(value)` y convierta `ZodError` en `BadRequestException`. Zod no es `ValidationPipe` ni pipe de Nest: es una librería de esquemas; el pipe es el adaptador que la conecta con la petición. No apliques a la vez dos validadores redundantes sin necesidad.

## Errores frecuentes

- DTO de TypeScript sin decoradores: no hay validación runtime.
- Usar una interface como DTO con `ValidationPipe`: Nest no puede obtener metadata de una interface borrada en compilación.
- Usar `@IsOptional()` en un campo no nullable: también omite validación para `null`. Para un campo opcional que no acepta null usa `@ValidateIf((_o, value) => value !== undefined)`.
- Confiar en validación para reglas de concurrencia: restricciones únicas y claves foráneas deben vivir también en PostgreSQL.

## Referencias

- [NestJS Validation](https://docs.nestjs.com/techniques/validation)
- [class-validator](https://github.com/typestack/class-validator)
- [class-transformer](https://github.com/typestack/class-transformer)
- [Zod](https://zod.dev/)
