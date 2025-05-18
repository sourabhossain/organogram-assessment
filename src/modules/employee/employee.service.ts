import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/common/entities/employee.entity';
import { PositionEntity } from 'src/common/entities/position.entity';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { EmployeeResponseDto } from './dto/employee-response.dto';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(PositionEntity)
        private positionRepo: Repository<PositionEntity>,

        @InjectRepository(EmployeeEntity)
        private employeeRepo: Repository<EmployeeEntity>
    ) {}

    async getAllPositions(): Promise<PositionEntity[]> {
        return this.positionRepo.find({ relations: ['parent'] });
    }

    async createPosition(dto: CreatePositionDto): Promise<PositionEntity> {
        const position = new PositionEntity();
        position.name = dto.name;

        if (dto.parent_id) {
            position.parent = await this.positionRepo.findOneBy({ id: dto.parent_id });

            if (!position.parent) {
                throw new NotFoundException('Parent position not found');
            }
        } else {
            position.parent = null;
        }

        return this.positionRepo.save(position);
    }

    async getAllEmployees(): Promise<EmployeeEntity[]> {
        return this.employeeRepo.find({ relations: ['position'] });
    }

    async createEmployee(dto: CreateEmployeeDto): Promise<EmployeeEntity> {
        const position = await this.positionRepo.findOneBy({ id: dto.position_id });

        if (!position) {
            throw new NotFoundException(`Position with id ${dto.position_id} not found`);
        }

        const employee = this.employeeRepo.create({
            full_name: dto.full_name,
            email: dto.email,
            phone: dto.phone,
            hired_date: dto.hired_date,
            position: position
        });

        return this.employeeRepo.save(employee);
    }

    async getEmployeesUnderPosition(positionId: number): Promise<EmployeeResponseDto[]> {
        const position = await this.positionRepo.findOneBy({ id: positionId });

        if (!position) {
            throw new NotFoundException(`Position with id ${positionId} not found`);
        }

        const raw: EmployeeResponseDto[] = await this.employeeRepo.query<EmployeeResponseDto[]>(
            `
            WITH RECURSIVE descendants AS (
                SELECT id FROM \`position\` WHERE id = ?
                UNION ALL
                SELECT p.id
                FROM \`position\` p
                INNER JOIN descendants d ON p.parent_id = d.id
            )
            SELECT e.*
            FROM \`employee\` e
            WHERE e.position_id IN (SELECT id FROM descendants)
            `,
            [positionId]
        );

        return raw;
    }
}
