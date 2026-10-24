# 08. Inyección de dependencias (DI)

DI significa que una clase declara qué necesita y un contenedor se encarga de crear y entregar esas dependencias. En Nest, las clases se registran como providers en módulos; el tipo del parámetro constructor suele ser el token de inyección.

```ts
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  findAll() {
    return this.products.findAll();
  }
}
```

No hay `new ProductsService()` en el controller. El módulo registra ambas piezas:

```ts
@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
```

Durante el arranque, Nest lee metadata de módulos, arma el grafo de dependencias y crea las instancias necesarias. El alcance predeterminado de un provider es singleton dentro del contexto de la app; existen otros scopes para casos concretos.

### Tokens personalizados

Cuando se inyecta un valor o una abstracción que no es una clase, se puede usar un token:

```ts
export const CURRENCY = Symbol('CURRENCY');

@Module({ providers: [{ provide: CURRENCY, useValue: 'USD' }] })
export class ProductsModule {}

@Injectable()
export class PriceLabel {
  constructor(@Inject(CURRENCY) private readonly currency: string) {}
}
```

El ejemplo breve de la API usa tokens de clase para enfocarse en los fundamentos. Los custom providers se explicarán en el capítulo avanzado de DI.

## Referencias

- [Inyección de dependencias](https://docs.nestjs.com/providers#dependency-injection)
- [Providers personalizados](https://docs.nestjs.com/fundamentals/custom-providers)
- [Scopes](https://docs.nestjs.com/fundamentals/injection-scopes)
