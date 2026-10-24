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
    const product: Product = { id: this.nextId++, name: input.name, price: input.price };
    this.products.push(product);
    return product;
  }

  update(id: number, input: UpdateProductDto): Product {
    const product = this.findOne(id);
    if (input.name !== undefined) product.name = input.name;
    if (input.price !== undefined) product.price = input.price;
    return product;
  }

  remove(id: number): void {
    const index = this.products.findIndex((item) => item.id === id);
    if (index === -1) throw new NotFoundException(`No existe el producto ${id}`);
    this.products.splice(index, 1);
  }
}


