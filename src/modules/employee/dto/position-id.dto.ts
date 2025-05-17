import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PositionIdDto {
    @ApiProperty({ description: 'Position ID', example: 1, type: Number })
    @IsNumber()
    id: number;
}
