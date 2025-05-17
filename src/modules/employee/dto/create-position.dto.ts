import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePositionDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiPropertyOptional()
    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    parent_id?: number;
}
