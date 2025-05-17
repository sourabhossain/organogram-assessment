import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeeEntity } from 'src/common/entities/employee.entity';
import { PositionEntity } from 'src/common/entities/position.entity';
import { PositionsController } from './positions.controller';
import { EmployeesController } from './employee.controller';

@Module({
    imports: [TypeOrmModule.forFeature([EmployeeEntity, PositionEntity])],
    providers: [EmployeeService],
    controllers: [PositionsController, EmployeesController],
    exports: [EmployeeService]
})
export class EmployeeModule {}
