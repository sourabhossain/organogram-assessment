import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateEmployeeDto {
    @ApiProperty()
    @IsString()
    full_name: string;

    @ApiProperty()
    @IsNumber()
    position_id: number;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    hired_date?: string;
}
