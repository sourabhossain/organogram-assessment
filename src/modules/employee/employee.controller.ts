import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { EmployeeService } from './employee.service';
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
    async getEmployees(@Param('id', ParseIntPipe) id: number): Promise<EmployeeResponseDto[]> {
        return this.employeeService.getEmployeesUnderPosition(id);
    }
}
