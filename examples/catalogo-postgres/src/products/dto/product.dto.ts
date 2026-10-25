import { IsInt, IsOptional, IsString, Length, Min, ValidateIf } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string | null;

  @IsInt()
  @Min(0)
  priceInCents!: number;

  @IsInt()
  @Min(1)
  categoryId!: number;
}

export class UpdateProductDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Length(2, 100)
  name?: string;

  // Null explicitly clears the nullable database column; undefined leaves it unchanged.
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string | null;

  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  @Min(0)
  priceInCents?: number;

  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  @Min(1)
  categoryId?: number;
}
