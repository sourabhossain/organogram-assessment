import { ApiProperty } from '@nestjs/swagger';

export class EmployeeResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'John Doe' })
    full_name: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    email: string;

    @ApiProperty({ example: '017xxxxxxxx' })
    phone?: string;

    @ApiProperty({ example: '2020-01-15' })
    hired_date?: string;
}
