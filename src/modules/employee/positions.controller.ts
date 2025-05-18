import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { CreatePositionDto } from './dto/create-position.dto';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { EmployeeService } from './employee.service';

@ApiTags('positions')
@ApiBearerAuth()
@Controller('positions')
@UseGuards(JwtAuthGuard)
export class PositionsController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Get()
    @ApiOperation({ summary: 'Get all positions' })
    getAllPositions() {
        return this.employeeService.getAllPositions();
    }

    @Post()
    @ApiOperation({ summary: 'Create a new position' })
    createPosition(@Body() dto: CreatePositionDto) {
        return this.employeeService.createPosition(dto);
    }

    @Get(':id/employees')
    @ApiOperation({ summary: 'Get all employees under a position (recursive)' })
    @ApiParam({ name: 'id', description: 'Position ID', type: Number })
    @ApiOkResponse({ type: [EmployeeResponseDto] })
    async getEmployees(@Param('id', ParseIntPipe) id: number): Promise<EmployeeResponseDto[]> {
        return this.employeeService.getEmployeesUnderPosition(id);
    }
}
