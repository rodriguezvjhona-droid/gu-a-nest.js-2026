# 12. Middleware

## Definición y propósito

Middleware ejecuta una función antes de que la ruta concreta procese la petición. Recibe request, response y `next()`. Se usa para tareas transversales de bajo nivel, como logging de acceso, añadir un request id o adaptar headers.

El middleware suele ejecutarse antes de guards, pipes y controller. Como se ejecuta temprano, no es el mejor lugar para autorización basada en metadata de Nest: para eso existen guards.

## Middleware HTTP para Express

Nest usa Express por defecto. Este ejemplo sigue la firma del adaptador Express; si cambias a Fastify, comprueba la compatibilidad y tipos de la plataforma elegida.

```ts
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

@Injectable()
export class RequestLogMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLogMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = randomUUID();
    const startedAt = Date.now();
    res.setHeader('x-request-id', requestId);

    res.on('finish', () => {
      this.logger.log(
        `${requestId} ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - startedAt}ms`,
      );
    });

    next();
  }
}
```

Evita registrar body, cookies, tokens y datos personales: pueden contener secretos. El request id ayuda a correlacionar logs sin exponer el contenido de la petición.

## Registrar el middleware en el módulo

```ts
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

@Module({ imports: [ProductsModule] })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestLogMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
```

También puedes restringirlo a un controller o ruta. Nest soporta middleware funcional además de clases; las clases son cómodas si necesitan dependencias inyectadas.

## Orden y diferencia con otros componentes

- Middleware: ejecuta antes de que Nest llegue al guard; suele trabajar con request/response.
- Guard: decide si la petición puede continuar y conoce `ExecutionContext` y metadata.
- Pipe: convierte/valida un argumento antes del handler.
- Interceptor: envuelve la ejecución del handler, antes y después.

## Referencias

- [Middleware de NestJS](https://docs.nestjs.com/middleware)
- [Request lifecycle](https://docs.nestjs.com/faq/request-lifecycle)
