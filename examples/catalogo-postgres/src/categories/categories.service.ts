import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';
import { Category } from './category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categories.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categories.findOneBy({ id });
    if (!category) throw new NotFoundException(`No existe la categoría ${id}`);
    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const duplicate = await this.categories.findOneBy({ name: dto.name });
    if (duplicate) throw new ConflictException('Ya existe una categoría con ese nombre');
    return this.categories.save(this.categories.create(dto));
  }

  async replace(id: number, dto: CreateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    await this.ensureNameAvailable(dto.name, id);
    category.name = dto.name;
    return this.categories.save(category);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    if (dto.name !== undefined) {
      await this.ensureNameAvailable(dto.name, id);
      category.name = dto.name;
    }
    return this.categories.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    const productCount = await this.products.count({ where: { category: { id } } });
    if (productCount > 0) {
      throw new ConflictException('No se puede borrar una categoría que todavía tiene productos');
    }
    await this.categories.remove(category);
  }

  private async ensureNameAvailable(name: string, exceptId?: number): Promise<void> {
    const duplicate = await this.categories.findOneBy({ name });
    if (duplicate && duplicate.id !== exceptId) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }
  }
}
