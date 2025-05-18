import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeService } from './employee.service';

@ApiTags('employees')
@ApiBearerAuth()
@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeesController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Get()
    @ApiOperation({ summary: 'Get all employees' })
    getAllEmployees() {
        return this.employeeService.getAllEmployees();
    }

    @Post()
    @ApiOperation({ summary: 'Create a new employee' })
    createEmployee(@Body() dto: CreateEmployeeDto) {
        return this.employeeService.createEmployee(dto);
    }
}
