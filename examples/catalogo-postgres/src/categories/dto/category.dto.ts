import { IsString, Length, ValidateIf } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(2, 100)
  name!: string;
}

export class UpdateCategoryDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Length(2, 100)
  name?: string;
}
