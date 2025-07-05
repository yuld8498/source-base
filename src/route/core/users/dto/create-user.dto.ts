import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string
}
