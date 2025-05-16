import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PositionIdDto } from './dto/position-id.dto';
import { EmployeeResponseDto } from './dto/employee-response.dto';

@ApiTags('positions')
@ApiBearerAuth()
@Controller('positions')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Get(':id/employees')
    @ApiOperation({ summary: 'Get all employees under a position (recursive)' })
    @ApiParam({ name: 'id', description: 'Position ID', type: Number })
    @ApiOkResponse({ type: [EmployeeResponseDto] })
    async getEmployees(@Param() params: PositionIdDto): Promise<EmployeeResponseDto[]> {
        return this.employeeService.getEmployeesUnderPosition(params.id);
    }
}
