import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'user1', description: 'Username of the user' })
    @IsString()
    username: string;

    @ApiProperty({ example: 'password123', description: 'Password of the user' })
    @IsString()
    @MinLength(6)
    password: string;
}
