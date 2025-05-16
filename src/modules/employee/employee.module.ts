import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { EmployeeEntity } from 'src/common/entities/employee.entity';
import { PositionEntity } from 'src/common/entities/position.entity';

@Module({
    imports: [TypeOrmModule.forFeature([EmployeeEntity, PositionEntity])],
    providers: [EmployeeService],
    controllers: [EmployeeController],
    exports: [EmployeeService]
})
export class EmployeeModule {}
