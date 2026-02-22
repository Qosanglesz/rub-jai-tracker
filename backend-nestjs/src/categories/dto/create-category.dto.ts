import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from '../entities/category.entity';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Salary' })
  @IsString()
  name: string;

  @ApiProperty({ enum: CategoryType, example: CategoryType.INCOME })
  @IsEnum(CategoryType)
  type: CategoryType;

  @ApiProperty({ example: 'dollar-sign', required: false })
  @IsOptional()
  @IsString()
  icon?: string;
}
