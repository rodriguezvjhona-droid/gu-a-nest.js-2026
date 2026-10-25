# 13. Guards y autorización

## Propósito

Un guard decide si una petición puede llegar al handler. Implementa `CanActivate`; su método puede devolver `boolean`, `Promise<boolean>` u `Observable<boolean>`. Devolver `false` niega el acceso (Nest responde 403 por defecto); también puede lanzarse una excepción HTTP concreta.

Un guard sirve para autenticación/autorización porque recibe `ExecutionContext`, conoce el controller y handler, y puede leer metadata de decoradores. Autenticación confirma quién es el usuario; autorización decide qué puede hacer.

## Roles con metadata y Reflector

`@Roles()` es un decorador propio de la aplicación: Nest no incluye un decorador de roles listo para usar.

```ts
// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type Role = 'admin' | 'editor' | 'reader';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

```ts
// roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ROLES_KEY, type Role } from './roles.decorator';

type AuthenticatedRequest = Request & { user?: { roles?: Role[] } };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const granted = request.user?.roles ?? [];
    const allowed = required.some((role) => granted.includes(role));
    if (!allowed) throw new ForbiddenException('No tienes el rol requerido');
    return true;
  }
}
```

Este `Request` es el del adaptador Express predeterminado. Con Fastify, adapta el tipo a ese adaptador. `Reflector.getAllAndOverride()` consulta metadata de handler y controller; la metadata del handler prevalece.

## Aplicación a una ruta

```ts
import { UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@UseGuards(RolesGuard)
@Roles('admin')
@Delete(':id')
remove(@Param('id', ParseIntPipe) id: number) {
  return this.products.remove(id);
}
```

Registra el guard en `providers` del módulo que contiene la ruta:

```ts
@Module({
  controllers: [ProductsController],
  providers: [ProductsService, RolesGuard],
})
export class ProductsModule {}
```

Este guard presupone que un componente de autenticación anterior llenó `request.user`. **No autentica tokens por sí mismo.** En el ejemplo del catálogo las rutas quedan públicas y el guard se deja disponible como pieza de referencia; antes de aplicar `@Roles()` en producción agrega una estrategia JWT/Passport que valide credenciales y construya `request.user`.

## Alcance

Un guard puede aplicarse a un handler, controller o globalmente. Para global y con DI, es común registrarlo mediante `APP_GUARD` desde un módulo. Un guard global aplica a todas las rutas salvo que se implemente una convención para declararlas públicas.

## Autenticación, autorización y validación

| Concepto | Pregunta | Ejemplo |
|---|---|---|
| Autenticación | ¿Quién eres? | validar JWT y obtener usuario |
| Autorización | ¿Qué puedes hacer? | exigir rol `admin` para borrar |
| Validación | ¿La entrada tiene forma aceptable? | comprobar que el precio sea entero no negativo |

No uses un guard para validar cada campo del body; para eso están DTOs y pipes.

## Errores frecuentes

- Implementar roles, pero no validar la identidad: un role guard sin autenticación confiaría en datos no comprobados.
- Olvidar registrar el guard si requiere DI.
- Devolver `false` y esperar un 401: `false` produce 403 por defecto; lanza `UnauthorizedException` para credenciales no válidas.
- Permitir un rol por defecto cuando falta `request.user`: el ejemplo usa `[]` y deniega el acceso.

## Referencias

- [Guards](https://docs.nestjs.com/guards)
- [Authorization](https://docs.nestjs.com/security/authorization)
- [Execution context](https://docs.nestjs.com/fundamentals/execution-context)
- [Request lifecycle](https://docs.nestjs.com/faq/request-lifecycle)
