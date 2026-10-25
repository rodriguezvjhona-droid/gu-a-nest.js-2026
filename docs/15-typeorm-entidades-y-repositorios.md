# 15. TypeORM: entidades, relaciones y repositorios

## ORM y entidad

TypeORM es un ORM externo. Una **entity** es una clase mapeada a una tabla. `@nestjs/typeorm` aporta integración Nest, como registrar repositorios en módulos e inyectarlos mediante `@InjectRepository()`.

```ts
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category!: Category;
}
```

Para cada entity declara tipos/longitudes/requeridos de forma intencional. Las entidades no son DTOs: las entidades representan persistencia; los DTOs representan el contrato HTTP.

## Relación uno a muchos

En TypeORM se define `@ManyToOne` en el lado que almacena la foreign key y `@OneToMany` en el lado inverso:

```ts
// product.entity.ts: cada producto apunta a una categoría
@ManyToOne(() => Category, (category) => category.products, { onDelete: 'RESTRICT' })
category!: Category;

// category.entity.ts: relación inversa (no crea otra foreign key)
@OneToMany(() => Product, (product) => product.category)
products!: Product[];
```

Las relaciones `1:1` y `N:M` se declaran con `@OneToOne`, `@ManyToMany` y, para N:M, normalmente una tabla puente. No uses `cascade` sin entender qué escrituras y borrados puede propagar.

## Registrar e inyectar repositorios

```ts
@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  providers: [ProductsService],
})
export class ProductsModule {}
```

```ts
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}
}
```

`forFeature()` registra providers de repositorio para las entidades del módulo. `@InjectRepository()` pide ese provider al contenedor de Nest.

## CRUD con Repository

```ts
const product = await this.products.findOne({
  where: { id },
  relations: { category: true },
});
if (!product) throw new NotFoundException('Producto no encontrado');

const saved = await this.products.save(
  this.products.create({ name: dto.name, priceInCents: dto.priceInCents }),
);
```

- `find`, `findOne`, `findOneBy`: lecturas.
- `create`: crea una instancia en memoria, no escribe por sí solo.
- `save`: inserta o actualiza según clave primaria.
- `delete`/`remove`: borrar; distingue borrar por criterio de eliminar una entidad cargada.

La API completa de dos entidades se encuentra en [examples/catalogo-postgres](../examples/catalogo-postgres/README.md).

## Migraciones vs `synchronize`

`synchronize: true` puede crear/modificar tablas a partir de entities al iniciar. Es cómodo para un ejercicio temporal, pero la documentación advierte que puede causar pérdida de datos; no lo habilites en producción. Usa migraciones versionadas para que cada cambio de esquema sea revisable y reproducible.

Una migración implementa `MigrationInterface` con `up(queryRunner)` y `down(queryRunner)`. `up` aplica el cambio y `down` lo revierte cuando es viable. Conserva cambios de esquema junto con cambios de código.

## Buenas prácticas

- Aplica filtros, límites y ordenamientos allowlisted en la consulta; evita descargar toda la tabla.
- No construyas SQL concatenando texto del usuario. Para SQL especial usa QueryBuilder o parámetros.
- Usa transacciones cuando varios cambios deben confirmarse o revertirse en conjunto.
- Mapea errores únicos/FK a respuestas HTTP comprensibles sin enviar SQL/credenciales al cliente.
- Cierra recursos correctamente; `TypeOrmModule` administra el ciclo de vida del DataSource del módulo.

## Referencias

- [NestJS TypeORM](https://docs.nestjs.com/data/typeorm)
- [TypeORM entities](https://typeorm.io/docs/entity/)
- [TypeORM relations](https://typeorm.io/docs/relations/)
- [TypeORM repositories](https://typeorm.io/docs/working-with-entity-manager/repository-api/)
- [TypeORM transactions](https://typeorm.io/docs/transactions/)
