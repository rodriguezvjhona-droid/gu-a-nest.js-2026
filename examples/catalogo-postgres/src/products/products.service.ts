import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/category.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.products.find({
      relations: { category: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.products.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!product) throw new NotFoundException(`No existe el producto ${id}`);
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const category = await this.findCategory(dto.categoryId);
    const { categoryId: _categoryId, ...fields } = dto;
    const product = this.products.create({
      ...fields,
      description: dto.description ?? null,
      category,
    });
    return this.products.save(product);
  }

  async replace(id: number, dto: CreateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    product.category = await this.findCategory(dto.categoryId);
    product.name = dto.name;
    product.description = dto.description ?? null;
    product.priceInCents = dto.priceInCents;
    return this.products.save(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.priceInCents !== undefined) product.priceInCents = dto.priceInCents;
    if (dto.categoryId !== undefined) {
      product.category = await this.findCategory(dto.categoryId);
    }
    return this.products.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.products.remove(product);
  }

  private async findCategory(id: number): Promise<Category> {
    const category = await this.categories.findOneBy({ id });
    if (!category) throw new NotFoundException(`No existe la categoría ${id}`);
    return category;
  }
}
