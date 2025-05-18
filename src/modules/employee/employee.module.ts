import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/common/entities/employee.entity';
import { PositionEntity } from 'src/common/entities/position.entity';
import { EmployeesController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { PositionsController } from './positions.controller';

@Module({
    imports: [TypeOrmModule.forFeature([EmployeeEntity, PositionEntity])],
    providers: [EmployeeService],
    controllers: [PositionsController, EmployeesController],
    exports: [EmployeeService]
})
export class EmployeeModule {}
