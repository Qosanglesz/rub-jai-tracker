import { IsString, IsNumber, IsDateString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGoalDto {
  @ApiProperty({ example: 'New iPhone 15' })
  @IsString()
  name: string;

  @ApiProperty({ example: 40000 })
  @IsNumber()
  @Min(1)
  targetAmount: number;

  @ApiProperty({ example: '2024-12-31' })
  @IsDateString()
  deadline: string;
}

export class UpdateGoalDto {
  @ApiProperty({ example: 'New iPhone 15 Pro', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 45000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  targetAmount?: number;
  
  @ApiProperty({ example: 5000, required: false, description: 'Added some savings to this goal' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentAmount?: number;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}
