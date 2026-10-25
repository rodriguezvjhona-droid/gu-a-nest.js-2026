# 11. Pipes

## Qué hace un pipe

Un pipe es un provider con `transform(value, metadata)`. Nest lo ejecuta antes del handler para transformar un valor o rechazarlo. El pipe recibe el valor ya extraído de los parámetros HTTP y puede lanzar una excepción HTTP.

Los pipes resuelven parseo/validación a nivel de parámetro. `class-validator` valida las propiedades del DTO; `ValidationPipe` conecta esos decoradores con la petición.

## Pipes integrados

| Pipe | Uso |
|---|---|
| `ParseIntPipe` | convertir parámetro a entero |
| `ParseFloatPipe` | convertir parámetro a decimal |
| `ParseBoolPipe` | convertir `true`/`false` |
| `ParseUUIDPipe` | comprobar UUID |
| `ParseEnumPipe` | restringir valor a un enum |
| `ParseArrayPipe` | convertir/validar arreglo según opciones |
| `DefaultValuePipe` | valor por defecto para ausencia |
| `ValidationPipe` | validar DTO con reglas runtime |

```ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.products.findOne(id);
}
```

Una ruta como `/products/abc` produce `400 Bad Request` antes de ejecutar `findOne`.

## Valores por defecto

```ts
@Get()
findAll(
  @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
) {
  return this.products.findAll({ limit });
}
```

En producción añade un máximo en el servicio o en un pipe de paginación para que un cliente no solicite una colección ilimitada.

## Pipe personalizado

Este pipe recorta espacios de un string y rechaza valores vacíos:

```ts
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimRequiredPipe implements PipeTransform<unknown, string> {
  transform(value: unknown): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('Se esperaba texto');
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new BadRequestException('El texto no puede estar vacío');
    }
    return trimmed;
  }
}
```

```ts
@Post()
create(@Body('name', TrimRequiredPipe) name: string) {
  return this.products.create({ name });
}
```

Para un DTO completo normalmente se usa `ValidationPipe`, no se valida campo por campo con pipes separados.

## Alcance

Puedes aplicar pipes a un argumento, método, controller o globalmente. El ámbito más pequeño ayuda a ver a qué dato afecta. Los pipes globales de DTO se suelen registrar en `main.ts`; pipes de id se suelen asociar a `@Param()`.

## Errores frecuentes

- Escribir un método de validación y creer que ya es un Nest pipe: un pipe debe implementar `transform` y estar registrado/aplicado.
- Usar `Number()` sin revisar `NaN`, infinitos o valores inválidos: prefiere `ParseIntPipe` o validación explícita.
- Usar `ParseIntPipe` para UUID: usa `ParseUUIDPipe`.

## Referencias

- [Pipes](https://docs.nestjs.com/pipes)
- [Validation](https://docs.nestjs.com/techniques/validation)
