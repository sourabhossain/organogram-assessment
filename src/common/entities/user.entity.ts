import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, Unique } from 'typeorm';
import { CommonEntity } from './common.entity';
import { EmployeeEntity } from './employee.entity';
import { RoleEntity } from './role.entity';
import { AuditLog } from './audit-log.entity';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity('users')
@Unique(['username'])
export class UserEntity extends CommonEntity {
    @OneToOne(() => EmployeeEntity, (employee) => employee.user, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'employee_id' })
    employee: EmployeeEntity;

    @Column({ length: 100 })
    username: string;

    @Column({ length: 256 })
    password_hash: string;

    @Column({ default: true })
    is_active: boolean;

    @ManyToMany(() => RoleEntity, (role) => role.users)
    @JoinTable({
        name: 'user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
    })
    roles: RoleEntity[];

    @OneToMany(() => RefreshTokenEntity, (token) => token.user)
    refreshTokens: RefreshTokenEntity[];

    @OneToMany(() => AuditLog, (audit) => audit.user)
    auditLogs: AuditLog[];
}
