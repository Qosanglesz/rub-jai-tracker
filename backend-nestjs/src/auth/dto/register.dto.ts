import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail({}, { message: 'Must be a valid email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Wissarut' })
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
