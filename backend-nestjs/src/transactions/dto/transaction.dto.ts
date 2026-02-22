import { IsNumber, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: 150.50 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '2023-10-25T10:00:00Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Groceries at Tops', required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ example: 'some-uuid-here' })
  @IsUUID()
  categoryId: string;
}

export class UpdateTransactionDto {
  @ApiProperty({ example: 150.50, required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ example: '2023-10-25T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ example: 'Groceries at Tops', required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ example: 'some-uuid-here', required: false })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
