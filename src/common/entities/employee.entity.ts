import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { PositionEntity } from './position.entity';
import { UserEntity } from './user.entity';

@Entity('employee')
@Index('idx_employee_position', ['position'])
export class EmployeeEntity extends CommonEntity {
    @Column({ length: 200 })
    full_name: string;

    @ManyToOne(() => PositionEntity, (position) => position.children, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'position_id' })
    position: PositionEntity;

    @Column({ length: 150, unique: true })
    email: string;

    @Column({ length: 50, nullable: true })
    phone: string;

    @Column({ type: 'date', nullable: true })
    hired_date: string;

    @OneToOne(() => UserEntity, (user) => user.employee)
    user: UserEntity;
}
