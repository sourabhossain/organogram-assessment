import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/common/entities/employee.entity';
import { PositionEntity } from 'src/common/entities/position.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(PositionEntity)
        private positionRepo: Repository<PositionEntity>,

        @InjectRepository(EmployeeEntity)
        private employeeRepo: Repository<EmployeeEntity>
    ) {}

    async getEmployeesUnderPosition(positionId: number): Promise<EmployeeEntity[]> {
        const position = await this.positionRepo.findOneBy({ id: positionId });
        if (!position) throw new NotFoundException('Position not found');

        const query = `
      WITH RECURSIVE descendants AS (
        SELECT id FROM position WHERE id = $1
        UNION ALL
        SELECT p.id FROM position p
        INNER JOIN descendants d ON p.parent_id = d.id
      )
      SELECT e.* FROM employee e
      WHERE e.position_id IN (SELECT id FROM descendants)
    `;

        const employees = await this.employeeRepo.query(query, [positionId]);
        return employees;
    }
}
