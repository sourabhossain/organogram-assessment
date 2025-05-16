import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class PositionIdDto {
    @ApiProperty({ description: 'Position ID', example: 1 })
    @IsInt()
    @Min(1)
    id: number;
}
